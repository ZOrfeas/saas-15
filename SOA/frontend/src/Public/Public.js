import './Public.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavComponent from '../Nav/Nav'
import Footer from '../Footer/Footer'
import Home from './Home'
import QuestionsPerKeyword from './QuestionsPerKeyword'
import Container from 'react-bootstrap/Container'

function Public() {
  return (
      <Router>
        <NavComponent />
        <Container fluid className='content-wrapper'>
          <Route exact path='/' component={Home} />
          <Route path='/keywords' component={QuestionsPerKeyword} />
        </Container>
        <Footer />
      </Router>
  )
}

export default Public
