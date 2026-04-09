using System.Security.Claims;
using HouseOfHope.API.Contracts;
using HouseOfHope.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HouseOfHope.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    LighthouseDbContext lighthouseDb,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager) : ControllerBase
{
    [HttpPost("register-with-roles")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var email = request.Email?.Trim();
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var requestedRoles = (request.Roles ?? [])
            .Where(r => !string.IsNullOrWhiteSpace(r))
            .Select(r => r.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (requestedRoles.Any(r => string.Equals(r, AuthRoles.Admin, StringComparison.OrdinalIgnoreCase)))
        {
            return BadRequest(new { message = "Self-registration cannot assign the admin role." });
        }

        var normalizedRoles = new List<string> { AuthRoles.Donor };

        var existingUser = await userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            return BadRequest(new { message = "An account with that email already exists." });
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            var message = createResult.Errors.FirstOrDefault()?.Description ?? "Unable to create account.";
            return BadRequest(new { message });
        }

        var roleResult = await userManager.AddToRolesAsync(user, normalizedRoles);
        if (!roleResult.Succeeded)
        {
            var message = roleResult.Errors.FirstOrDefault()?.Description ?? "Unable to assign roles.";
            return BadRequest(new { message });
        }

        var existingSupporter = await lighthouseDb.Supporters
            .FirstOrDefaultAsync(s => s.Email != null && s.Email.ToLower() == email.ToLower());
        if (existingSupporter == null)
        {
            lighthouseDb.Supporters.Add(new Supporter
            {
                DisplayName = !string.IsNullOrWhiteSpace(request.DisplayName) ? request.DisplayName.Trim() : email,
                Email = email,
                SupporterType = "MonetaryDonor",
                Status = "Inactive",
                AcquisitionChannel = "Website"
            });
            await lighthouseDb.SaveChangesAsync();
        }

        if (!string.IsNullOrWhiteSpace(request.DisplayName))
        {
            await userManager.AddClaimAsync(user, new Claim("supporter_display_name", request.DisplayName.Trim()));
        }

        await signInManager.SignInAsync(user, isPersistent: false);

        return Ok(new
        {
            message = "Registration successful.",
            roles = normalizedRoles
        });
    }

    [HttpPost("admin/promote-donor")]
    [Authorize(Policy = AuthPolicies.ManageData)]
    public async Task<IActionResult> PromoteDonorToAdmin([FromBody] PromoteDonorToAdminRequest request)
    {
        if (request.SupporterId is null && string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { message = "Provide supporterId or email." });
        }

        Supporter? supporter = null;
        if (request.SupporterId is not null)
        {
            supporter = await lighthouseDb.Supporters.AsNoTracking()
                .FirstOrDefaultAsync(s => s.SupporterId == request.SupporterId.Value);
            if (supporter == null)
            {
                return NotFound(new { message = "Supporter not found." });
            }
        }

        var email = request.Email?.Trim();
        if (string.IsNullOrWhiteSpace(email))
        {
            email = supporter?.Email?.Trim();
        }
        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest(new { message = "This donor does not have a linked login email." });
        }

        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return BadRequest(new { message = "No registered login was found for this donor email." });
        }

        if (!await userManager.IsInRoleAsync(user, AuthRoles.Donor))
        {
            await userManager.AddToRoleAsync(user, AuthRoles.Donor);
        }

        var alreadyAdmin = await userManager.IsInRoleAsync(user, AuthRoles.Admin);
        if (!alreadyAdmin)
        {
            var addAdminResult = await userManager.AddToRoleAsync(user, AuthRoles.Admin);
            if (!addAdminResult.Succeeded)
            {
                var message = addAdminResult.Errors.FirstOrDefault()?.Description ?? "Unable to promote donor to admin.";
                return BadRequest(new { message });
            }
        }

        return Ok(new
        {
            message = alreadyAdmin ? "Donor is already an admin." : "Donor promoted to admin.",
            email
        });
    }

    [HttpGet("admin/unlinked-donor-logins")]
    [Authorize(Policy = AuthPolicies.ManageData)]
    public async Task<ActionResult<List<UnlinkedLoginDto>>> GetUnlinkedDonorLogins()
    {
        var currentEmail = User.FindFirstValue(ClaimTypes.Email)?.Trim();
        var linkedEmails = await lighthouseDb.Supporters.AsNoTracking()
            .Where(s => s.Email != null && s.Email != "")
            .Select(s => s.Email!.Trim().ToLower())
            .ToListAsync();
        var linkedSet = linkedEmails.ToHashSet();

        var donorUsers = await userManager.GetUsersInRoleAsync(AuthRoles.Donor);
        var list = donorUsers
            .Where(u => !string.IsNullOrWhiteSpace(u.Email))
            .Where(u => !string.Equals(u.Email, currentEmail, StringComparison.OrdinalIgnoreCase))
            .Where(u => !linkedSet.Contains((u.Email ?? "").Trim().ToLower()))
            .Select(u => new UnlinkedLoginDto
            {
                UserId = u.Id,
                Email = u.Email!
            })
            .OrderBy(u => u.Email)
            .ToList();

        return list;
    }

    [HttpPost("admin/link-donor-login")]
    [Authorize(Policy = AuthPolicies.ManageData)]
    public async Task<IActionResult> LinkDonorToLogin([FromBody] LinkDonorLoginRequest request)
    {
        if (request.SupporterId <= 0 || string.IsNullOrWhiteSpace(request.UserId))
        {
            return BadRequest(new { message = "supporterId and userId are required." });
        }

        var supporter = await lighthouseDb.Supporters.FirstOrDefaultAsync(s => s.SupporterId == request.SupporterId);
        if (supporter == null)
        {
            return NotFound(new { message = "Supporter not found." });
        }

        var user = await userManager.FindByIdAsync(request.UserId);
        if (user == null || string.IsNullOrWhiteSpace(user.Email))
        {
            return BadRequest(new { message = "Login account not found." });
        }

        var alreadyLinkedToOther = await lighthouseDb.Supporters.AsNoTracking()
            .AnyAsync(s => s.SupporterId != supporter.SupporterId &&
                           s.Email != null &&
                           s.Email.ToLower() == user.Email.ToLower());
        if (alreadyLinkedToOther)
        {
            return BadRequest(new { message = "That login email is already linked to another donor." });
        }

        if (!await userManager.IsInRoleAsync(user, AuthRoles.Donor))
        {
            return BadRequest(new { message = "Selected login is not a donor account." });
        }

        supporter.Email = user.Email;
        await lighthouseDb.SaveChangesAsync();

        return Ok(new { message = "Donor linked to login successfully.", email = supporter.Email });
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentSession()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            return Ok(new
            {
                isAuthenticated = false,
                userName = (string?)null,
                email = (string?)null,
                roles = Array.Empty<string>()
            });
        }

        var user = await userManager.GetUserAsync(User);
        if (user == null)
        {
            // Identity API cookie may occasionally lack one lookup path; try common fallbacks.
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrWhiteSpace(userId))
            {
                user = await userManager.FindByIdAsync(userId);
            }

            if (user == null)
            {
                var email = User.FindFirstValue(ClaimTypes.Email) ?? User.Identity?.Name;
                if (!string.IsNullOrWhiteSpace(email))
                {
                    user = await userManager.FindByEmailAsync(email);
                }
            }
        }

        var rolesFromStore = user == null
            ? Array.Empty<string>()
            : (await userManager.GetRolesAsync(user)).ToArray();
        var rolesFromClaims = User.Claims
            .Where(c => c.Type == ClaimTypes.Role)
            .Select(c => c.Value)
            .ToArray();
        var roles = rolesFromStore
            .Concat(rolesFromClaims)
            .Where(r => !string.IsNullOrWhiteSpace(r))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(role => role)
            .ToArray();

        var supporterDisplayName = User.Claims.FirstOrDefault(c => c.Type == "supporter_display_name")?.Value;

        return Ok(new
        {
            isAuthenticated = true,
            userName = user?.UserName ?? User.Identity?.Name,
            email = user?.Email,
            supporterDisplayName,
            roles
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok(new { message = "Logout successful." });
    }
}

public class RegisterRequest
{
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? DisplayName { get; set; }
    public List<string>? Roles { get; set; }
}

public class PromoteDonorToAdminRequest
{
    public int? SupporterId { get; set; }
    public string? Email { get; set; }
}

public class LinkDonorLoginRequest
{
    public int SupporterId { get; set; }
    public string UserId { get; set; } = "";
}
