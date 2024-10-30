import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client"; // Adjust import as needed for your setup
import { GET_ME } from "../utils/queries"; // Adjust to your actual queries file
import { REMOVE_BOOK } from "../utils/mutations"; // Adjust to your actual mutations file
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import type { User } from "../models/User";

const SavedBooks = () => {
  const { data, loading, error } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK, {
    onCompleted: (data) => {
      // Handle any additional logic after the mutation completes if necessary
      console.log(data);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  // Check for loading or error state from the useQuery hook
  if (loading) return <h2>LOADING...</h2>;
  if (error) return <h2>Error fetching user data!</h2>;

  const userData: User = data.getMe; // Assuming your GraphQL query returns user data under getMe

  // Create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId }, // Pass bookId as a variable to the mutation
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
