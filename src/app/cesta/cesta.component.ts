import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Produto } from '../model/produto';
import { LojaService } from '../services/loja.service';
import { PedidoCompleto } from '../model/PedidoCompleto';
import { ProdutoCesta } from '../model/ProdutoCesta';
import { Pedido } from '../model/Pedido';
import { ListaRemovidos } from '../model/ListaRemovidos';

@Component({
  selector: 'app-cesta',
  templateUrl: './cesta.component.html',
  styleUrls: ['./cesta.component.css']
})
export class CestaComponent implements OnInit {    
  
  
  listaProdutos: ProdutoCesta[] = [];  
  spinner: boolean = true;
  pedidoCompleto: PedidoCompleto = {
    idPedido: 0,
    idUsuario: 0,
    produtos: this.listaProdutos,
  };   
  prodRemovidos: ListaRemovidos = {
    listaIds: []
  };
  nroPedido: number = 0;
  nroUsuario: number = 0;
  total: number = this.pedidoCompleto.produtos.reduce((total, b) => total + b.total , 0);
  load: boolean = true;

  constructor(private router: Router, private lojaService: LojaService, private rota: ActivatedRoute ) {}

  //-----foi utilizado setTimeOut para aguardar a resposta da API pois por algum motivo não identificado função assincrona não estava aguardando-----
  async ngOnInit(): Promise<any>{ 
    this.rota.params.subscribe(params => this.nroPedido = Number(params['idpedido']));  
    //this.getPedido();  
    if(this.pedidoCompleto.produtos.length < 1){
      setTimeout(() => {        
        this.getPedido();        
        this.total = this.pedidoCompleto.produtos.reduce((total, b) => total + b.total , 0);  
        this.load = false;      
      }, 2500)
    }       
  }

  conta = this.pedidoCompleto.produtos.length;  


  //atualiza as informações do pedido no banco e redireciona para a tela de login, transportando pela URL numero do pedido e numero do novo usuario   
  async finalizaCompra(e: any){    
    let x = e.target;
    x.setAttribute("class", "btn btn-warning");
    x.setAttribute("disabled", "disabled");
    x.innerText = 'Carregando...';
    await this.atualizaPedido();
    if(this.prodRemovidos.listaIds.length > 0){
      setTimeout(() => {
          this.removePedidos();    
        }, 2000)
    }
    if(this.nroUsuario == 0){
      setTimeout(() => {this.router.navigate(['login/' + this.nroPedido + '/' + this.nroUsuario]);}, 3000)
    }      
  }

  //atualiza a quantidade e o valor total do produto
  atualizaQuantidade(produto: ProdutoCesta, quantidade: number){   
    var index = this.pedidoCompleto.produtos.indexOf(produto);
    produto.quantidade = Number(quantidade);    
    produto.total = produto.valor * quantidade;
    this.pedidoCompleto.produtos[index] = produto;    
    this.total = this.pedidoCompleto.produtos.reduce((total, b) => total + b.total , 0);    
  }

  //remove um produto da lista de compras
  removeProduto(produto: ProdutoCesta){
    if(window.confirm('Confirmar remoçao?')){
      this.prodRemovidos.listaIds.push(Number(produto.idProduto));

      var index = this.pedidoCompleto.produtos.indexOf(produto);
      this.pedidoCompleto.produtos.splice(index,1);

      this.conta = this.pedidoCompleto.produtos.length;
      this.total = this.pedidoCompleto.produtos.reduce((total, b) => total + b.total , 0);
    }    
  }

  //envia o numero do pedido para o banco que retorna um OBJ PedidoCompleto
  async getPedido() : Promise<any>{
    return this.lojaService.getPedidoCompleto(this.nroPedido).subscribe((pedido: PedidoCompleto) => {
      this.pedidoCompleto = pedido;      
      console.log(this.pedidoCompleto)      
    });
  }

  //envia um obj PedidoCompleto para o banco, onde é tratado para atualizar o pedido
  async atualizaPedido() : Promise<any> {
      var a = this.lojaService.atualizaPedidoCompleto(this.pedidoCompleto).subscribe((resp: number) => {
      this.nroUsuario = resp;     
      return resp;    
    });    
  } 

  //chama o metodo da API para remover produtos de um pedido enviando o numero do pedido e os produtos que devem ser removidos
  removePedidos(){        
    this.lojaService.removePedido(Number(this.nroPedido),this.prodRemovidos).subscribe((resp: any) => {
    var a = resp;         
    });    
    console.log(this.prodRemovidos);    
  }


}
