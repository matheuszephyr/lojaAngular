import { Component, OnInit } from '@angular/core';
import { Produto } from '../model/produto';
import { LojaService } from '../services/loja.service';
import { Router } from '@angular/router';
import { CestaComponent } from '../cesta/cesta.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  listaProdutos: Produto[] = [];    
                
  contador: number = 0;
  nroPedido: number = 0;  
  listaCesta: Produto[] = [];  

  constructor(private lojaService: LojaService, private router: Router) { }

  ngOnInit() {    
    this.getProdutos();
  }

  //busca todos os produtos no banco para listar
  getProdutos() {
    return this.lojaService.getProdutos().subscribe((produtos: Produto[]) => {
      this.listaProdutos = produtos;      
    });
  }

  //envia a lista de produtos selecionados para o banco onde é criado um pedido e direciona ára a cesta enviando o numero do pedido gerado por URL
  gotoCesta(e: any){  
    if(this.listaCesta.length < 1){
      alert("Selecione pelo menos 1 produto!")
    }  
    else{
      let x = e.target;      
      x.setAttribute("disabled", "disabled");
      x.innerText = 'Carregando...'; 
      if(this.listaCesta.length > 0){         
        var a = this.adcPedido(this.listaCesta);
      }
      
      if(this.nroPedido == 0){
        setTimeout(() => {
          this.router.navigate(['cesta/' + this.nroPedido]);
        }, 4000)
      }

      this.router.navigate(['cesta/' + this.nroPedido]);             
    }    
  }

  //adiciona produto a listaCesta ou remove caso ja esteja adicionado
  adcCesta(prod: Produto, e: any) {     
    var index = this.listaCesta.indexOf(prod);
    let x = e.target;
    if(index == -1){
      this.listaCesta.push(prod);    
      this.contador++;      
      x.setAttribute("class", "btn btn-danger");
      x.innerText = 'Remover da Cesta';
    }
    else
    {
      this.listaCesta.splice(index,1);
      this.contador--;      
      x.setAttribute("class", "btn btn-primary");
      x.innerText = 'Adicionar a Cesta';
    }     
  }

  //envia lista de produtos selecionados para a API que retorna o numero do novo pedido gerado
  adcPedido(produtos: Produto[]) {
    this.lojaService.savePedido(produtos).subscribe(response => {
      this.nroPedido = response;      
    });
  } 





}
