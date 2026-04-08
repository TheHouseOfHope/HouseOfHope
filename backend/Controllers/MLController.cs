using HouseOfHope.API.Data;
using HouseOfHope.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HouseOfHope.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MLController : ControllerBase
{
    private readonly SocialMediaPredictionService _predictionService;

    public MLController(SocialMediaPredictionService predictionService)
    {
        _predictionService = predictionService;
    }

    [HttpPost("social-media/predict")]
    [Authorize(Policy = "ManageData")]
    public ActionResult<SocialMediaPredictionResult> Predict([FromBody] SocialMediaPredictionInput input)
    {
        try
        {
            var result = _predictionService.Predict(input);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
