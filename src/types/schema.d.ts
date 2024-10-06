export interface ISocialPlatform {
    platform: 'twitter' | 'reddit' | 'telegram' | 'discord';
    userIdentifier: string;
    joined: boolean;
    joinDate?: Date;
    pointsEarned: number;
  }
  
  // Interface for Task
  export interface ITask {
    taskName: string;
    completed: boolean;
    completedDate?: Date;
  }
  
  // Interface for User Document
  export interface userModelProps extends Document {
    userId?:string;
    userName?:string;
    userType:string;
    name?:string;
    points:number;
    status:string;
    walletAddress?:string;
    socialPlatforms: ISocialPlatform[];
    tasksCompleted: ITask[];
    createdAt: Date;
  }