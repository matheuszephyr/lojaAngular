import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../model/Usuario';
import { LojaService } from '../services/loja.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nroPedido: number;
  nroUsuario: number; 
  usuario: Usuario = {
    idUsuario: undefined,
    email: undefined,
    nome: undefined,
    telefone: undefined
  };
  usuarioapi: Usuario;

  constructor(private router: Router, private rota: ActivatedRoute, private lojaService: LojaService) {
    this.rota.params.subscribe(params => this.nroPedido = params['idpedido']);
    this.rota.params.subscribe(params => this.nroUsuario = params['idusuario']);
  }

  ngOnInit(): void {
    
  }

  gotoFinal(nome: string, email: string, telefone: number, e: any) {
        
    if(nome != "" && email != "" && telefone.toString() != "")
    {
      let x = e.target;
      x.setAttribute("class", "btn btn-warning");
      x.setAttribute("disabled", "disabled");
      x.innerText = 'Carregando...';       
      var a = this.nroUsuario;    

      this.usuario.idUsuario = Number(a);
      this.usuario.nome = nome;
      this.usuario.email = email;
      this.usuario.telefone = Number(telefone);         
      this.salvaUsuario(this.usuario);          
      setTimeout(() => {this.router.navigate(['final/' + this.nroPedido + '/' + this.nroUsuario]);}, 3000);      
    }
    else
    {
      alert("Informe todos os dados.")
    }
  }  

  //envia usuario para ser salvo na API 
  salvaUsuario(usu: Usuario){
    this.lojaService.saveUsuario(usu).subscribe(response => {
      var a = response;      
    });
  }

}
