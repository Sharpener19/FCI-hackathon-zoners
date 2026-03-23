export interface ZoningBylaw {
  id: string;
  bylawNumber: string;
  title: string;
  category: string;
  status: 'Active' | 'Amended' | 'Repealed';
  dateEnacted: string;
  lastAmended: string;
  description: string;
  url: string;
  tags: string[];
}

export interface ZoningStats {
  total: number;
  active: number;
  amended: number;
  categories: Record<string, number>;
}
