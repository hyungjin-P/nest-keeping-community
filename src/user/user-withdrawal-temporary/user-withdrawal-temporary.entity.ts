import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_withdrawal_temporary')
export class UserWithdrawalTemporary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  reason: string;
}
