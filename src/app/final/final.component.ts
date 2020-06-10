import { Component, OnInit } from '@angular/core';
import { PedidoCompleto } from '../model/PedidoCompleto';
import { ProdutoCesta } from '../model/ProdutoCesta';
import { Usuario } from '../model/Usuario';
import { LojaService } from '../services/loja.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.css']
})
export class FinalComponent implements OnInit {

  nroPedido: number = 0;
  nroUsuario: number = 0;

  constructor(private lojaService: LojaService, private rota: ActivatedRoute, private router: Router) {
    this.rota.params.subscribe(params => this.nroPedido = params['idpedido']);
    this.rota.params.subscribe(params => this.nroUsuario = params['idusuario']);
   }  

  listaProdutos: ProdutoCesta[] = [];
  pedidoCompleto: PedidoCompleto = {
    idPedido: 0,
    idUsuario: 0,
    produtos: this.listaProdutos,
  };   

  total: number = this.pedidoCompleto.produtos.reduce((total, b) => total + b.total , 0);;

  usuario: Usuario = {
    email: "",
    idUsuario: 0,
    nome: "",
    telefone: 0
  };

  ngOnInit(): void {
    this.getPedido();
    this.getUsuario();
    if(this.pedidoCompleto.produtos.length < 1){
      setTimeout(() => {this.total = this.pedidoCompleto.produtos.reduce((total, b) => total + b.total , 0);}, 2000)
    } 
  }

  getPedido(){
    return this.lojaService.getPedidoCompleto(this.nroPedido).subscribe((pedido: PedidoCompleto) => {
      this.pedidoCompleto = pedido;            
    });
  }

  getUsuario(){
    return this.lojaService.getUsuarioPorId(this.nroUsuario).subscribe((usuario: Usuario) => {
      this.usuario = usuario;            
    });
  }

  voltarHome(){
    this.router.navigate(['home/']);
  }



}
