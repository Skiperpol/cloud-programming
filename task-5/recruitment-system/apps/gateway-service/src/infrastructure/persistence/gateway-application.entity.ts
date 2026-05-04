import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'gateway_applications' })
export class GatewayApplicationEntity {
  @PrimaryColumn('uuid')
  applicationId!: string;

  @Column()
  email!: string;

  @Column()
  fileName!: string;

  @Column()
  extension!: string;

  @Column({ type: 'int', default: 0 })
  sizeBytes!: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  uploadedAt!: Date;

  @Column({ default: '' })
  s3ObjectKey!: string;
}
