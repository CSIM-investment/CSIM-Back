import { Injectable } from '@nestjs/common';
import { CryptoCurrencyMarket } from 'src/crypto/model/cryptocurrency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DbHistoryService {
    
    
    constructor(
        @InjectRepository( CryptoCurrencyMarket )
        private cryptoRepository: Repository<CryptoCurrencyMarket>,
    ) {}

}
