import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const axios = require('axios')
const browse_url = process.env.REACT_APP_BROWSE_URL
const answer_url = process.env.REACT_APP_ANSWER_URL

function Question() {
  const [question, setQuestion] = useState({})
  const [answerText, setAnswerText] = useState('')
  const { id } = useParams()

  // get question object on reload
  useEffect(() => {
    axios.get(`${browse_url}/question?id=${id}`)
        .then(response => {
          setQuestion(response.data)
        })
        .catch(error => {
          console.log(error)
        })
  }, [])

  // submit handler to post new answer
  const handleSubmit = e => {
    e.preventDefault()
    const answer = {
      ansContent: answerText,
      question: question
    }
    const token = JSON.parse(localStorage.getItem('token'))
    const config = { headers: { 'Authorization': `Bearer ${token}` } }

    axios.post(`${answer_url}/create`, answer, config)
        .then(() => {
          // reload page to get updated question
          window.location.reload(true)
        })
        .catch(error => {
          console.log(error)
        })
  }

  const dateFormat = date => {
    const dateObj = new Date(date.split('.')[0])
    const [, month, dayNum, year] = dateObj.toDateString().split(' ')
    return `${month}, ${dayNum} ${year}`
  }

  return (
      <div  className='w-100' style={{ maxWidth: '950px' }}>
        <Card.Header className='py-4'>
          <h5 className='font-weight-bold mb-0'>{question.title}</h5>
        </Card.Header>

        <Card.Body className='question'>
          <p>{question.questContent}</p>
          <div className='keywords mb-2'>
            {question.keywords &&
            question.keywords.map(keyword => (
                <Badge key={keyword.id} className='keyword-badge mr-1'>{keyword.name}</Badge>
            ))}
          </div>
          <p className='date-user text-muted mb-0 px-0'>
            asked on {question.askedOn && dateFormat(question.askedOn)} by {question.user?.displayName ? question.user.displayName : '[deleted]'}
          </p>
        </Card.Body>

        <Card.Body className='answers'>
          <p>
            {question.answers?.length !== undefined && `${question.answers.length} answer`}
            {question.answers?.length !== undefined && question.answers.length != 1 && 's'}
          </p>
          <ListGroup className="list-group-flush">
            {question.answers &&
            question.answers.map(answer => (
                <ListGroup.Item key={answer.id}>
                  <p>{answer.ansContent}</p>
                  <p className='date-user text-muted mb-0 px-0'>
                    answered on {answer.answeredOn && dateFormat(answer.answeredOn)} by {answer.displayName ? answer.displayName : '[deleted]'}
                  </p>
                </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>

        <Card.Body className='post-answer'>
          <div className='text-center'>
            <span className='material-icons-outlined mr-2 idea-icon'>lightbulb</span>
            Feel like something is missing or have a brilliant idea?
            <p>Post your answer.</p>
          </div>

          <Form noValidate validated={false} onSubmit={handleSubmit}>
            <Form.Group controlId='formGroupTextarea'>
              <Form.Label>Your answer</Form.Label>
              <Form.Control
                  as='textarea'
                  name='answer-text'
                  onChange={e => setAnswerText(e.target.value)}
                  style={{ height: '175px' }}
                  required
              />
              <Form.Control.Feedback type='invalid'>
                Answer cannot be empty
              </Form.Control.Feedback>
            </Form.Group>
            <div className='text-right'>
              <Button variant='success' type='submit'>Add your answer</Button>
            </div>
          </Form>

        </Card.Body>
      </div>
  )
}

export default Question
