export interface UserInfoType {
  vacationtype?: string;
  vacationstarts?: { year: number; month: number; day: number };
  vacationends?: { year: number; month: number; day: number };
  vacationtotal?: { original: string };
}

export interface SceneInfoItemType {
  displayText: string;
  sceneId: string;
  audioText: string[];
}
export type SceneInfoType = SceneInfoItemType[];

export interface SceneType {
  isSessionEnd: boolean;
  userInfo: UserInfoType;
  sceneInfo: SceneInfoType;
}
