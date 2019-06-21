import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import {gql} from 'apollo-boost';
import {ApolloProvider, Query} from 'react-apollo';
import './semantic.min.css';
import './index.css';

  const client = new ApolloClient({
    uri: 'https://dog-graphql-api.glitch.me/graphql'
  });

  const GET_DOGS = gql`
    {
      dogs {
        id
        breed
      }
    }
  `;

  const Dogs = ({onQuery}) => (
    <Query query={GET_DOGS}>
      {
        (obj) => onQuery(obj)
      }
    </Query>
  );

  const GET_DOG_PHOTO = gql`
      query Dog($breed: String!) {
        dog(breed: $breed) {
          id
          displayImage
        }
      }
  `;

  const DogPhoto = ({ breed }) => (
    <Query query={GET_DOG_PHOTO} variables={{ breed }}>
      {({loading, error, data}) => {
        if (loading) return null;
        if (error) return `${error}`;

        return (
          <img className="ui centered huge image" src={data.dog.displayImage} alt="" />
        );
      }}
    </Query>
  );

  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        dogs: null,
        selectedDog: '',
      }
    }

    onQuery({loading, error, data}) {
      if (loading) return <p>Loading...</p>;
      if (error) return `Error! ${error.message}`;

      if (!this.state.dogs) {
        this.setState({
          dogs: data.dogs,
          selectedDog: data.dogs[0].breed,
        });
      }

      return (
        <div>
          <select className="ui search fluid dropdown" name="dog" onChange={(obj) => this.onDogSelected(obj)}>
            {
              data.dogs.map(dog => (
                <option key={dog.id} value={dog.breed}>
                  {dog.breed}
                </option>
              ))
            }
          </select>
        </div>
      );
    }

    onDogSelected({ target }) {
      this.setState({
        selectedDog: target.value,
      });
    }

    render () {
      return (
        <ApolloProvider client={client}>
          <div>
            <h1>Furry Pics</h1>
            <Dogs onQuery={(obj) => this.onQuery(obj)} />
            <h2 className="ui centered header">{this.state.selectedDog}</h2>
            <DogPhoto breed={this.state.selectedDog} />
          </div>
        </ApolloProvider>
      );
    }
  }

  // ========================================

  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
