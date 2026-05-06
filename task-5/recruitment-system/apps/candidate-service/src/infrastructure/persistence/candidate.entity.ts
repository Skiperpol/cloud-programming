import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'candidates' })
export class CandidateEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;
}
