import { InputType, ObjectType } from '@nestjs/graphql'
import { CryptoMarketInput, CryptoMarketOutput } from './cryptoMarket-create.dto';

@InputType()
export class UpdateCryptoInput extends CryptoMarketInput {

}

@ObjectType()
export class UpdateCryptoOutput extends CryptoMarketOutput {
    
}