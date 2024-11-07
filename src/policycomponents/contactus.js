export const ContactUsPage = ()=>{
    return(
        <div>
            <h1>Contact Us</h1>
            <p>If you have any questions, please feel free to contact us through the form below:</p>

            <form action="mailto:prakashprasad968@gmail.com" method="POST">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required/>

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required/>

                <label htmlFor="subject">Subject:</label>
                <input type="text" id="subject" name="subject"/>

                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message" required></textarea>

                <button type="submit">Send Message</button>
            </form>

            <p>Alternatively, you can reach us at:</p>
            <ul>
                <li>Email: <a href="prakashprasad968@gmail.com">prakashprasad968@gmail.com.com</a></li>
                <li>Phone: +91 9676006061</li>
                <li>Address: gandhi street, Rayavaram,, India</li>
            </ul>
        </div>
    )
}