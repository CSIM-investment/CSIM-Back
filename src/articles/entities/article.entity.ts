import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Index({ fulltext: true })
  @Column()
  @Field()
  title: string

  @Index({ fulltext: true })
  @Column({ type: 'longtext' })
  @Field()
  description: string

  @Index({ fulltext: true })
  @Column({ nullable: true })
  @Field({ nullable: true })
  source: string

  @Index({ fulltext: true })
  @Column({ nullable: true })
  @Field({ nullable: true })
  author: string

  @Column({ type: 'datetime' })
  @Field(() => Date)
  publishedDate: Date

  @Index({ fulltext: true })
  @Column({ nullable: true })
  @Field({ nullable: true })
  symbol: string

  @Column({ unique: true })
  @Field()
  url: string
}
