import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Home.css';

export default function Home() {
    return (
        <div className="home-container">
            <h1>Benvenuti su Vintage Cars</h1>
            <p>Scopri e acquista le auto d'epoca più iconiche, selezionate per appassionati e collezionisti.</p>

            <div>
                <Carousel>
                    <Carousel.Item>
                        <Image width='90%' src="/img/1.jpg" alt="First slide" rounded />
                        <Carousel.Caption>
                            <h3>Ford Mustang Shelby 500GT</h3>
                            <p className='text-white'>Una delle auto iconiche di Carroll Shelby torna in vita in modo leggendario.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image width='90%' src="/img/2.jpg" alt="Second slide" rounded />
                        <Carousel.Caption>
                            <h3>Opel Kadett 1968</h3>
                            <p className='text-white'>Il modello base di Opel, un'auto familiare economica.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image width='90%' src="/img/3.jpg" alt="Third slide" rounded />
                        <Carousel.Caption>
                            <h3> Porsche 911 1973</h3>
                            <p className='text-white'> Un'auto sportiva di lusso iconica a due porte prodotta da Porsche dal 1964, rinomata per il suo motore a sei cilindri montato posteriormente e la configurazione dei sedili 2+2.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
            <div>
                <h2 style={{ color: '#b48a78', marginTop: '40px' }}>I nostri Top Brands</h2>
                <Image width={290} style={{ marginLeft: '20px' }} src="/img/ford_logo.png" alt="Ford logo" rounded />
                <Image width={250} style={{ marginLeft: '20px' }} src="/img/bmw_logo.png" alt="BMW logo" rounded />
                <Image width={270} style={{ marginLeft: '15px' }} src="/img/porsche_logo.png" alt="Porsche logo" rounded />
                <Image width={290} style={{ marginLeft: '20px' }} src="/img/audi_logo.png" alt="Audi logo" rounded />
            </div>
        </div >

    );
}
