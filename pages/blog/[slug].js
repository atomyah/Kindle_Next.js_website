//import matter from "gray-matter"
import { getAllBlogs, getSingleBlog } from "../../utils/mdQueries"
import PrevNext from "../../components/prevNext"
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import Layout from "../../components/layout"
import Seo from "../../components/seo"

const SingleBlog = (props) => {
    //console.log(props) //出力=> {frontmatter: {id: '2',title: 'ふたつ目の記事',data: '2021--03-02',…},markdownBody: '\r\nこれはふたつ目の記事です。'}
    return (
        <Layout>
            <Seo title={props.frontmatter.title} description={props.frontmatter.excerpt} />
            <div className="img-container">
                <Image src={props.frontmatter.image} alt="blog-image" height={500} width={1000} priority />
            </div>        
            <div className="wrapper">
                <div className="container">    
                    <h1>{props.frontmatter.title}</h1>
                    <p>{props.frontmatter.date}</p>
                    <ReactMarkdown>{props.markdownBody}</ReactMarkdown>
                </div>
                <PrevNext prev={props.pref} next={props.next} />
            </div>
        </Layout>
    )
}
export default SingleBlog



export async function getStaticPaths() {
    const {orderedBlogs} = await getAllBlogs()

    const paths = orderedBlogs.map((orderedBlog) => `/blog/${orderedBlog.slug}`)

    //console.log(paths) // 出力=> ['/blog/fifth-blog','/blog/first-blog','/blog/fourth-blog','/blog/second-blog','/blog/sixth-blog','/blog/third-blog']

    return {
        paths: paths, // すべてのパスを返す.
        fallback: false, // false指定=>paths以外のパス名に対して404エラーページ表示させるため
    }
}


export async function getStaticProps(context) {
    const { singleDocument } = await getSingleBlog(context)

    // 前後の記事へのクリッカブル矢印を追加するためのコード
    const { orderedBlogs } = await getAllBlogs()
    const prev = orderedBlogs.filter(orderedBlog => orderedBlog.frontmatter.id === singleDocument.data.id - 1)
    const next = orderedBlogs.filter(orderedBlog => orderedBlog.frontmatter.id === singleDocument.data.id + 1)
    // ここまで
    console.log('prev')
    console.log(prev) //出力：[ {frontmatter: {id: 1,uid: 1,title: '1つ目の記事',date: '2021-03-01',image:・・・・}, slug: 'first-blog'}]
    console.log('next') 
    console.log(next) //出力：[{frontmatter: {id: 3,uid: 3,title: '3つ目の記事',date: '2021-03-03',image:・・・・slug: 'third-blog'}]



    return {
        props: {
            frontmatter: singleDocument.data, // frontmatter部分.
            markdownBody: singleDocument.content, // content部分（frontmatterの下部に書かれた文章）
            pref: prev,
            next: next,
        }
    }
}

