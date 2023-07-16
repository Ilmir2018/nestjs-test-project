import { ApiProperty } from '@nestjs/swagger';
import { BeforeSave, Model } from 'sequelize-typescript';
import { Column, DataType, Table } from 'sequelize-typescript';

interface UserCrreationAttrs {
  email?: string;
  phone?: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCrreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'test@mail.com', description: 'Email пользователя' })
  @Column({ type: DataType.STRING, unique: true })
  email: string;

  @ApiProperty({ example: 'Сергей', description: 'Имя пользователя' })
  @Column({ type: DataType.STRING })
  username: string;

  @ApiProperty({
    example: '8-960-056-9420',
    description: 'Телефон пользователя',
  })
  @Column({ type: DataType.STRING, unique: true })
  phone: string;

  @ApiProperty({
    example: 'Russia',
    description: 'Страна в которой проживает пользователь',
  })
  @Column({ type: DataType.STRING })
  country: string;

  @ApiProperty({
    example: 'Kazan',
    description: 'Город в котором проживает пользователь',
  })
  @Column({ type: DataType.STRING })
  city: string;

  @ApiProperty({
    example: 'man',
    description: 'Пол пользователя',
  })
  @Column({ type: DataType.STRING })
  gender: string;

  @ApiProperty({
    example: 'Воронцов',
    description: 'Фамилия пользователя',
  })
  @Column({ type: DataType.STRING })
  surname: string;

  @ApiProperty({ example: 'qwerty', description: 'Пароль пользователя' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @BeforeSave
  static async emailToLowerCase(user: User): Promise<void> {
    user.email = user.email?.toLowerCase();
    user.username = user.username?.toLowerCase();
  }
}
