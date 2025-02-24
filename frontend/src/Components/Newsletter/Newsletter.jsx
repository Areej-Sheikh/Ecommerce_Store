import "./Newsletter.css"
const Newsletter = () => {
  return (
    <div className="newsletter" >
        <h1>Get Exclusive Offers On Your Email</h1>
        <p>Subscribe To Our Weekly Newsletter To Stay Updated</p>
        <div>
            <input type="email" placeholder="Enter Your E-mail" />
            <button>Subscribe</button>
        </div>
    </div>
  )
}

export default Newsletter