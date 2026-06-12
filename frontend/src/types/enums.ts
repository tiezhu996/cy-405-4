export enum InterviewStage {
  Applied = 'applied',
  FirstRound = 'first_round',
  SecondRound = 'second_round',
  ThirdRound = 'third_round',
  HrRound = 'hr_round',
  FinalRound = 'final_round',
  Offer = 'offer'
}

export enum InterviewResult {
  Pending = 'pending',
  Passed = 'passed',
  Rejected = 'rejected',
  Withdrawn = 'withdrawn'
}

export enum InterviewMode {
  Onsite = 'onsite',
  Video = 'video',
  Phone = 'phone'
}

export const boardStages = [
  InterviewStage.Applied,
  InterviewStage.FirstRound,
  InterviewStage.SecondRound,
  InterviewStage.ThirdRound,
  InterviewStage.Offer
] as const;

export type BoardStage = (typeof boardStages)[number];

export const interviewStageLabels: Record<InterviewStage, string> = {
  [InterviewStage.Applied]: '投递中',
  [InterviewStage.FirstRound]: '一面',
  [InterviewStage.SecondRound]: '二面',
  [InterviewStage.ThirdRound]: '三面',
  [InterviewStage.HrRound]: 'HR面',
  [InterviewStage.FinalRound]: '终面',
  [InterviewStage.Offer]: 'Offer'
};

export const interviewResultLabels: Record<InterviewResult, string> = {
  [InterviewResult.Pending]: '待面试',
  [InterviewResult.Passed]: '已通过',
  [InterviewResult.Rejected]: '已淘汰',
  [InterviewResult.Withdrawn]: '已放弃'
};

export const interviewModeLabels: Record<InterviewMode, string> = {
  [InterviewMode.Onsite]: '现场',
  [InterviewMode.Video]: '视频',
  [InterviewMode.Phone]: '电话'
};

export const stageRank: Record<InterviewStage, number> = {
  [InterviewStage.Applied]: 0,
  [InterviewStage.FirstRound]: 1,
  [InterviewStage.SecondRound]: 2,
  [InterviewStage.ThirdRound]: 3,
  [InterviewStage.HrRound]: 4,
  [InterviewStage.FinalRound]: 5,
  [InterviewStage.Offer]: 6
};
