import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import * as puppeteer from 'puppeteer';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { loginUserDto } from 'src/auth/dto/loginUser.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from 'src/users/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async validateUser(nim: number, password: string): Promise<any> {
    const user = await this.usersService.findOne(nim);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: loginUserDto) {
    const user = await this.validateUser(loginDto.nim, loginDto.password);
    if (!user) {
        throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
      }
    const payload = { sub: user.nim, email: user.email };
    return {
      statusCode: HttpStatus.OK,
      message: 'Login Success',
      data: {
        nim: user.nim,
        fullName: user.fullName,
        access_token: this.jwtService.sign(payload),
      },
    };
  }

  private async checkSiam(username: string, password: string) {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto('https://siam.ub.ac.id/', { waitUntil: 'networkidle2' });

    const usernameField = await page.$('input[name="username"]');
    await usernameField.type(username);

    const passwordField = await page.$('input[name="password"]');
    await passwordField.type(password);

    await Promise.all([
      page.waitForNavigation(), // The promise resolves after navigation has finished
      page.click('input[type="submit"]'),
    ]);

    const error = await page.$('small.error-code');
    if (error) {
      throw new HttpException(
        'NIM atau Password SIAM salah',
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await page.$$eval('div.bio-info div', (elements) =>
      elements.map((item) => item.textContent),
    );
    await browser.close();

    const fullName = data[1];
    const faculty = data[2].substring(19);
    const major = data[4].substring(13);

    return [fullName, faculty, major];
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    const find = await this.usersRepository.findOne(createUserDto.nim);

    if (find) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    user.nim = createUserDto.nim;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    const [fullName, faculty, major] = await this.checkSiam(
      createUserDto.nim.toString(),
      createUserDto.password,
    );
    user.role = await this.rolesRepository.findOne({name: 'user'});
    if(createUserDto.role){
        user.role = await this.rolesRepository.findOne({name: createUserDto.role});
    }
    user.fullName = fullName;
    user.faculty = faculty;
    user.major = major;
    
    return this.usersRepository.save(user);
  }
}
