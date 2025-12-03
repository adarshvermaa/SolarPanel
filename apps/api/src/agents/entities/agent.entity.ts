import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('agents')
export class Agent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column()
    phone: string;

    @Column()
    companyName: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'simple-array', nullable: true })
    certifications: string[];

    @Column({ type: 'simple-array', nullable: true })
    serviceAreas: string[];

    @Column({ default: 'agent' })
    role: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ type: 'text', nullable: true })
    avatar: string;

    @Column({ type: 'int', default: 0 })
    completedInstallations: number;

    @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
    rating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
