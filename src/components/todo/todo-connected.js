import React, { useEffect, useState } from 'react';
import TodoForm from './form.js';
import TodoList from './list.js';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import './todo.scss';
import useAjax from '../../hooks/use-ajax.js';

const todoAPI = 'https://api-js401.herokuapp.com/api/v1/todo';


const ToDo = () => {

  const [list, setList] = useState([]);

  const _addItem = (item) => {
    item.due = new Date();
    useAjax(todoAPI, 'post', item)
      .then(response => response.json())
      .then(savedItem => {
        setList([...list, savedItem]);
      })
      .catch(console.error);
  };

  const _toggleComplete = id => {
    let item = list.filter(i => i._id === id)[0] || {};
    const itemStatus = JSON.parse(item.status);
    item.status = !(itemStatus);

    let url = `${todoAPI}/${id}`;
    useAjax(url, 'put', item, item._id)
      .then(response => response.json())
      .then(savedItem => {
        console.log(savedItem.status)
        setList(list.map(listItem => listItem._id === item._id ? savedItem : listItem));
      })
      .catch(console.error);
  };

  const _deleteTodoItem = id => {
    let item = list.filter(i => i._id === id)[0] || {};
    let url = `${todoAPI}/${id}`;
    useAjax(url, 'delete', item, item._id)
      .then(response => response.json())
      .then(savedItem => {
        _getTodoItems();
      })
      .catch(console.error);

  };

  const _getTodoItems = () => {
    useAjax(todoAPI, 'get')
      .then(data => data.json())
      .then(data => {
        data.results.map(item => {
          item.complete = false;
        })
        setList(data.results);
      })
      .catch(console.error);
  };

  useEffect(_getTodoItems, []);

  return (
    <>
      <header>
        <Navbar bg="primary" variant="dark" expand="lg">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
          </Nav>
        </Navbar>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Nav className="mr-auto">
            <h2>
              There are {list.filter(item => !item.complete).length} Items To Complete
            </h2>
          </Nav>
        </Navbar>

      </header>

      <section className="todo">

        <div>
          <TodoForm handleSubmit={_addItem} />
        </div>

        <div>
          <TodoList
            list={list}
            handleComplete={_toggleComplete}
            deleteOnClick={_deleteTodoItem}
          />
        </div>
      </section>
    </>
  );
};

export default ToDo;