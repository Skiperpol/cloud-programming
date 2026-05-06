import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parsed_documents' })
export class ParsedDocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column('simple-array')
  skills!: string[];
}
