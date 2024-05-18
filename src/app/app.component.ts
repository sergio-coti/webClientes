import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  //variáveis
  apiUrl: string = 'http://localhost:8081/api/clientes';
  clientes: any[] = [];

  //Método construtor
  constructor(
    private httpClient: HttpClient
  ) {
  }

  //objeto para desenvolver o formulário de cadastro
  formCadastro = new FormGroup({
    nomeCliente : new FormControl('', [
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente: new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefoneCliente: new FormControl('', [
      Validators.required, Validators.pattern(/^\d{11}$/)
    ])
  });

  //objeto para desenvolver o formulário de edição
  formEdicao = new FormGroup({
    idCliente: new FormControl(''),
    nomeCliente: new FormControl('', [
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente: new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefoneCliente: new FormControl('', [
      Validators.required, Validators.pattern(/^\d{11}$/)
    ])
  });

  //função para verificar se os campos do formulário de cadastro
  //estão com erro de validação e exibir mensagens
  get fCadastro() {
    return this.formCadastro.controls;
  }

  //função para verificar se os campos do formulário de edição
  //estão com erro de validação e exibir mensagens
  get fEdicao() {
    return this.formEdicao.controls;
  }

  //Método executado quando a página abrir
  ngOnInit(): void {    
    //fazendo uma requisição GET para api de consulta de clientes
    this.httpClient.get(this.apiUrl + '/consultar')
      .subscribe({ //capturando o retorno da API (resposta)
        next: (data) => {
          //armazenar os dados obtidos da API
          this.clientes = data as any[];
        }
      })
  }

  //Método executado no SUBMIT do formulário
  cadastrarCliente(): void {
    //fazendo uma requisição POST para api de cadastro de clientes
    this.httpClient.post(this.apiUrl + '/criar', this.formCadastro.value, { responseType: 'text' })
      .subscribe({ //capturando o retorno da API (resposta)
        next: (data) => {          
          this.formCadastro.reset(); //limpando o formulário
          this.ngOnInit(); //executando a consulta de clientes
          alert(data); //exibindo a mensagem
        }
      })
  }

  //Método executado ao clicar no botão de exclusão
  excluirCliente(idCliente: string): void {
    if(confirm('Deseja realmente excluir o cliente selecionado?')) {
      //enviando para a API excluir o cliente
      this.httpClient.delete(this.apiUrl + "/excluir/" + idCliente, { responseType : 'text' })
        .subscribe({ //capturando a resposta da API
          next: (data) => { //recebendo a mensagem de sucesso da API
            this.ngOnInit(); //executando a consulta novamente
            alert(data); //exibindo a mensagem            
          }
        })
    }
  }

  //Método para capturar o cliente selecionado na tela
  //e exibir os seus dados no formulário de edição
  obterCliente(c: any): void {
    //preencher os campos do formulário de edição
    this.formEdicao.controls['idCliente'].setValue(c.idCliente);
    this.formEdicao.controls['nomeCliente'].setValue(c.nomeCliente);
    this.formEdicao.controls['emailCliente'].setValue(c.emailCliente);
    this.formEdicao.controls['telefoneCliente'].setValue(c.telefoneCliente);
  }

  //Método para enviar uma requisição 
  //para o ENDPOINT de edição da API
  atualizarCliente(): void {
    //executando uma chamada PUT para a API
    this.httpClient.put(this.apiUrl + "/editar", this.formEdicao.value, { responseType: 'text' })
      .subscribe({ //capturando a resposta obtida da API
        next: (data) => { //recebendo a resposta de sucesso
          this.ngOnInit(); //executar a consulta novamente
          alert(data); //mostrando a mensagem na tela
        }
      });
  }
}
