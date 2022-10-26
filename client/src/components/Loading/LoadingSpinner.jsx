import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";

export default function LoadingSpinner() {
    return (
        <Card>
            <Card.Title className="d-flex justify-content-center header">
                Loading
            </Card.Title>
            <Card.Body className="d-flex justify-content-center header">
                <Spinner
                    className="d-flex justify-content-center "
                    animation="border"
                    role="status"
                    variant="primary"
                >
                    <span class="sr-only"></span>{" "}
                </Spinner>
            </Card.Body>
            <Card.Text className="d-flex justify-content-center header">
                Please wait for your transaction to complete :)
            </Card.Text>
        </Card>
    );
}
