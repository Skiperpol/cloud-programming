import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'blacklist_entries' })
export class BlacklistEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: true })
  blocked!: boolean;
}
