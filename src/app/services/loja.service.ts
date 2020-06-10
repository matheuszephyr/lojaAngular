import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Produto } from '../model/produto';
import { PedidoCompleto } from '../model/PedidoCompleto';
import { Usuario } from '../model/Usuario';
import { ListaRemovidos } from '../model/ListaRemovidos';
//import { EventEmitter } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class LojaService {

  static emitirListaCesta = new EventEmitter<any>();

  url = 'https://localhost:44309/api/loja'; 
  error: any;

  constructor(private httpClient: HttpClient) { }

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  } 

  //API: retorna todos os produtos
  getProdutos(): Observable<Produto[]> {
    return this.httpClient.get<Produto[]>(this.url + "/produto")
    .pipe(
      retry(2),
      catchError(this.error))     
  }
  
  //API: recebe lista de produtos, cria pedido, retorna numero do pedido
  savePedido(produtos: Produto[]): Observable<number> {
    return this.httpClient.post<any>(this.url + "/pedido", JSON.stringify(produtos), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.error)        
      )
  }  

  //API: recebe IDPEDIDO, e lista de IDPRODUTO e remove os produtos do pedido
  removePedido(idpedido: number, idprodutos: ListaRemovidos): Observable<any> {
    return this.httpClient.post<any>(this.url + "/pedidodelete/" + idpedido, JSON.stringify(idprodutos) , this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.error)        
      )
  }  

  //API: recebe numero do pedido e retorna o pedido completo
  getPedidoCompleto(id: number): Observable<PedidoCompleto> {
    return this.httpClient.get<PedidoCompleto>(this.url + "/pedidoCompleto/" + id, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.error))     
  }

  //API: recebe pedido completo e atualiza o pedido no banco
  atualizaPedidoCompleto(pedidoCompleto: PedidoCompleto): Observable<number>{
    return this.httpClient.put<number>(this.url + "/pedido", JSON.stringify(pedidoCompleto), this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.error)        
    );      
  }  

  //API: recebe usuario e insere no banco
  saveUsuario(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.url + "/usuario", JSON.stringify(usuario), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.error)        
      )
  } 

  //API: retorna usuario por ID
  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(this.url + "/usuario/" + id)
    .pipe(
      retry(2),
      catchError(this.error))     
  } 


}
