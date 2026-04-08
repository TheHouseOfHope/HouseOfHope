import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { predictSocialMediaPost } from '@/lib/api-endpoints';
import type { SocialMediaPredictionInput } from '@/lib/api-endpoints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, TrendingUp, DollarSign } from 'lucide-react';

const defaultInput: SocialMediaPredictionInput = {
  postHour: 19,
  numHashtags: 5,
  mentionsCount: 0,
  captionLength: 150,
  boostBudgetPhp: 0,
  isBoostedNum: 0,
  hasCallToActionNum: 1,
  featuresResidentStoryNum: 0,
  lexDonateHits: 1,
  lexUrgentHits: 0,
  lexGratitudeHits: 1,
  lexEmotionHits: 2,
  lexSentimentNet: 2,
  priorPostsSamePlatform: 10,
  hoursSinceLastSamePlatform: 48,
  platform: 'Facebook',
  postType: 'ImpactStory',
  mediaType: 'Photo',
  dayOfWeek: 'Tuesday',
  callToActionType: 'DonateNow',
  contentTopic: 'DonorImpact',
  sentimentTone: 'Hopeful',
};

export function PostOptimizer() {
  const [input, setInput] = useState<SocialMediaPredictionInput>(defaultInput);

  const mutation = useMutation({
    mutationFn: predictSocialMediaPost,
  });

  const setField = (field: keyof SocialMediaPredictionInput, value: string | number) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Post Optimizer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your post details to predict donation value and get recommendations
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs">Platform</Label>
            <Select value={input.platform} onValueChange={v => setField('platform', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Facebook', 'Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn', 'WhatsApp'].map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Post Type</Label>
            <Select value={input.postType} onValueChange={v => setField('postType', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['ImpactStory', 'FundraisingAppeal', 'Campaign', 'EventPromotion', 'EducationalContent', 'ThankYou'].map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Media Type</Label>
            <Select value={input.mediaType} onValueChange={v => setField('mediaType', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Photo', 'Video', 'Reel', 'Carousel', 'Text'].map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Day of Week</Label>
            <Select value={input.dayOfWeek} onValueChange={v => setField('dayOfWeek', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Post Hour (0-23)</Label>
            <Select value={String(input.postHour)} onValueChange={v => setField('postHour', parseInt(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={String(i)}>{i}:00</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Content Topic</Label>
            <Select value={input.contentTopic} onValueChange={v => setField('contentTopic', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['DonorImpact', 'Education', 'Health', 'Reintegration', 'SafehouseLife', 'EventRecap', 'CampaignLaunch', 'Gratitude', 'AwarenessRaising'].map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Sentiment</Label>
            <Select value={input.sentimentTone} onValueChange={v => setField('sentimentTone', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Hopeful', 'Urgent', 'Celebratory', 'Informative', 'Grateful', 'Emotional'].map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Call to Action</Label>
            <Select value={input.callToActionType} onValueChange={v => setField('callToActionType', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['DonateNow', 'LearnMore', 'ShareStory', 'SignUp', 'unknown'].map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Features Resident Story?</Label>
            <Select value={String(input.featuresResidentStoryNum)} onValueChange={v => setField('featuresResidentStoryNum', parseInt(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No</SelectItem>
                <SelectItem value="1">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={() => mutation.mutate(input)}
          disabled={mutation.isPending}
          className="w-full"
        >
          {mutation.isPending ? 'Predicting...' : '✨ Predict Post Performance'}
        </Button>

        {mutation.isError && (
          <p className="text-sm text-destructive">Failed to get prediction. Make sure you are logged in.</p>
        )}

        {mutation.data && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <DollarSign className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Predicted Donation Value</p>
                <p className="text-2xl font-bold text-primary">
                  ₱{Math.max(0, mutation.data.estimatedDonationValuePhp).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <TrendingUp className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Predicted Engagement Rate</p>
                <p className="text-2xl font-bold text-primary">
                  {(Math.max(0, mutation.data.engagementRate) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Recommendations:</p>
              {mutation.data.recommendations.map((rec, i) => (
                <div key={i} className="text-sm bg-muted/50 rounded-lg px-3 py-2">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}