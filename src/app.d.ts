interface Video {
  id: number;
  title: string;
  grade: number;
}

interface VideoChange {
  id: number;
  title?: string;
  grade?: number;
}
interface VideoChangeBody {
  title?: string;
  grade?: number;
}
interface GradeChange {
  id: number;
  value: number;
}
