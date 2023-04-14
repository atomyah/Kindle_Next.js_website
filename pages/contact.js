import Layout from "../components/layout"
import Seo from "../components/seo"

const Contact = () => {
    return (
        <Layout>
            <Seo title="お問い合わせ" description="コンタクトページです" />
            <div className="wrapper">
                <div className="container">
                    <h1>Contact</h1>
                    <p>お気軽にご連絡ください</p>
                    <form>
                        <label htmlFor="name">お名前</label>  
                        <input type="text" name="name" id="name" required/>
                        <label htmlFor="email">メールアドレス</label>
                        <input type="email" name="email" id="email" required/>
                        <label htmlFor="textarea">ご用件</label>
                        <textarea name="message" rows="10" id="textarea" required></textarea>
                        <button type="submit">送信</button>
                    </form> 
                </div>
            </div>        
        </Layout>
    )
}
export default Contact