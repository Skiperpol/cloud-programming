import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { QualificationStatus } from '../../../domain/qualification-status.enum';

@Entity({ name: 'qualification_decisions' })
export class QualificationDecisionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  result!: QualificationStatus;
}
