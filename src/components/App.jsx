import { Component } from 'react';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import css from './App.module.css';
import { PhonebookForm } from './PhonebookForm/PhonebookForm';
import { ContactsList } from './ContactsList/ContactsList';
import { Filter } from './Filter/Filter';

export class App extends Component {
  #LS_CONTACTS_KEY = 'contacts';
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem(this.#LS_CONTACTS_KEY);
    if (savedContacts) {
      this.setState({ contacts: JSON.parse(savedContacts) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts.length !== prevState.contacts.length) {
      localStorage.setItem(this.#LS_CONTACTS_KEY, JSON.stringify(this.state.contacts));
    }
  }

  handleAddContact = contact => {
    if (this.state.contacts.some(item => item.name.toLowerCase() === contact.name.toLowerCase())) {
      iziToast.warning({
        title: 'Caution',
        message: `${contact.name} is already in contacts`,
        timeout: 5000,
        position: 'topLeft',
      });
      return true;
    }
    this.setState(prevState => {
      return {
        contacts: [...prevState.contacts, contact],
      };
    });
    return false;
  };

  handleDeleteContact = id => {
    this.setState(prevState => {
      return {
        contacts: prevState.contacts.filter(contact => contact.id !== id),
      };
    });
  };

  handleChangeFilter = evt => {
    this.setState({ filter: evt.target.value });
  };

  handleFilterContacts = () => {
    return this.state.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.state.filter.toLowerCase().trim())
    );
  };

  render() {
    return (
      <div>
        <h1 className={css.titleForm}>Phonebook</h1>
        <PhonebookForm addContact={this.handleAddContact} />
        <h2 className={css.titleContacts}>Contacts</h2>
        <Filter value={this.state.filter} handleChange={this.handleChangeFilter} />
        <ContactsList
          contacts={this.handleFilterContacts()}
          deleteContact={this.handleDeleteContact}
        />
      </div>
    );
  }
}
