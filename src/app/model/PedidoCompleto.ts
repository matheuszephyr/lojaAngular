import { ProdutoCesta } from '../model/ProdutoCesta';

export class PedidoCompleto{
    idPedido: number;
    produtos: ProdutoCesta[];
    idUsuario: number;
}