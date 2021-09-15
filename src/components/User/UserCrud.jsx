import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";

const headerProps = {
  icon: "users",
  title: "Usuários",
  subtitle: "Cadastro de usuários: Incluir, Listar, Alterar e Excluir",
};

const baseURL = "http://localhost:3001/users";
const initialState = {
  //primeiro o user tera nome e email vazio, depois será preenchido com os dados
  user: { name: "", email: "" },

  //primeiro o user será vazio, depois será preenchido com os dados do usuário
  list: [],
};

export default class UserCrud extends Component {
  state = { ...initialState }; //estado inicial do componente

  componentWillMount() {
    axios(baseURL).then((resp) => {
      this.setState({ list: resp.data });
    });
  }

  clear() {
    //essa funcao limpa o formulário, para ser preenchudo com novos dados
    this.setState({ user: initialState.user });
  }

  save() {
    //essa funcao salva o usuário no banco de dados
    //user é o usuário que está sendo salvo
    const user = this.state.user;
    //method se identifica como POST ou PUT, se id existir, então é um PUT, se não, é um POST
    const method = user.id ? "put" : "post";
    //se user.id = true, a url fica como baseUrl + user.id, se não, a url fica como baseUrl
    const url = user.id ? `${baseURL}/${user.id}` : baseURL;
    //axios.put(url, user)
    //axios.post(url, user)
    axios[method](url, user).then((resp) => {
      //list fica com o usuário atualizado, muda o state
      const list = this.getUpdatedList(resp.data);
      this.setState({ user: initialState.user, list });
    });
  }

  getUpdatedList(user, add = true) {
    //essa funcao retorna uma lista com o usuário atualizado
    const list = this.state.list.filter((u) => u.id !== user.id);
    if (user) list.unshift(user);
    return list;
  }

  updateField(event) {
    //essa funcao atualiza o "email e nome"
    //event.target.name = nome do campo
    //event.target.value = valor do campo
    const user = { ...this.state.user };
    user[event.target.name] = event.target.value;
    this.setState({ user });
  }

  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={this.state.user.name}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o nome..."
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={this.state.user.email}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o e-mail..."
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={(e) => this.save(e)}>
              Salvar
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={(e) => this.clear(e)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  load(user) {
    this.setState({ user });
  }

  remove(user) {
    axios.delete(`${baseURL}/${user.id}`).then((resp) => {
      const list = this.getUpdatedList(user, false);
      this.setState({ list });
    });
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((user) => {
      return (
        <tr key={user.id}>
          {/* <td>{user.id}</td> */}
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>
            <button className="btn btn-warning" onClick={() => this.load(user)}>
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn btn-danger ml-2"
              onClick={() => this.remove(user)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}
