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
}
