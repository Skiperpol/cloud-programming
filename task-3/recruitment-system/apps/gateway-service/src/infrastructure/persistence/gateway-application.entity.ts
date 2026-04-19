import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'gateway_applications' })
export class GatewayApplicationEntity {
  @PrimaryColumn('uuid')
  applicationId!: string;

  @Column()
  email!: string;

  /** Base file name without extension */
  @Column()
  fileName!: string;

  @Column()
  extension!: string;

  /** Legacy rows synced before S3: 0 means unknown / not stored in S3 */
  @Column({ type: 'int', default: 0 })
  sizeBytes!: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  uploadedAt!: Date;

  /** S3 object key; empty string on legacy rows (no object in bucket) */
  @Column({ default: '' })
  s3ObjectKey!: string;
}
