// row จาก table `users` ใน Supabase
export interface UserRow {
  id: string;
  displayName: string;
}

// profile + balance (รวมจาก API ของ BNK48)
export interface UserProfile {
  id: string;
  displayName: string;
  profileImageUrl: string;
  coverImageUrl: string;
  caption?: string;
  totalFollowing: number;
  totalGiftAmount: number;
  spendableBalance?: number | null;
}
