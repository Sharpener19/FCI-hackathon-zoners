export interface User {
  id: string;
  name: string;
  avatar: string;
  reputation: number;
}

export interface Answer {
  id: string;
  content: string;
  author: User;
  votes: number;
  createdAt: string;
  isAccepted: boolean;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  votes: number;
  answers: Answer[];
  views: number;
  createdAt: string;
  isAnswered: boolean;
}
