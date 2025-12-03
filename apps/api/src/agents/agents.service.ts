import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AgentsService {
    constructor(
        @InjectRepository(Agent)
        private agentsRepository: Repository<Agent>,
    ) { }

    async create(createAgentDto: CreateAgentDto): Promise<Agent> {
        const hashedPassword = await bcrypt.hash(createAgentDto.password, 10);
        const agent = this.agentsRepository.create({
            ...createAgentDto,
            password: hashedPassword,
        });
        return this.agentsRepository.save(agent);
    }

    async findAll(): Promise<Agent[]> {
        return this.agentsRepository.find({
            select: ['id', 'email', 'fullName', 'phone', 'companyName', 'certifications', 'serviceAreas', 'isActive', 'isVerified', 'completedInstallations', 'rating', 'createdAt'],
        });
    }

    async findOne(id: number): Promise<Agent> {
        const agent = await this.agentsRepository.findOne({
            where: { id },
            select: ['id', 'email', 'fullName', 'phone', 'companyName', 'address', 'certifications', 'serviceAreas', 'isActive', 'isVerified', 'avatar', 'completedInstallations', 'rating', 'createdAt'],
        });
        if (!agent) {
            throw new NotFoundException(`Agent with ID ${id} not found`);
        }
        return agent;
    }

    async findByEmail(email: string): Promise<Agent | null> {
        return this.agentsRepository.findOne({ where: { email } });
    }

    async update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent> {
        const agent = await this.findOne(id);

        if (updateAgentDto.password) {
            updateAgentDto.password = await bcrypt.hash(updateAgentDto.password, 10);
        }

        Object.assign(agent, updateAgentDto);
        return this.agentsRepository.save(agent);
    }

    async remove(id: number): Promise<void> {
        const agent = await this.findOne(id);
        await this.agentsRepository.remove(agent);
    }

    async verify(id: number): Promise<Agent> {
        const agent = await this.findOne(id);
        agent.isVerified = true;
        return this.agentsRepository.save(agent);
    }

    async updateRating(id: number, rating: number): Promise<Agent> {
        const agent = await this.findOne(id);
        agent.rating = rating;
        return this.agentsRepository.save(agent);
    }
}
