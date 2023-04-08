import matter from "gray-matter"
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import Layout from "../../components/layout"

const SingleBlog = (props) => {
    //console.log(props) //出力=> {frontmatter: {id: '2',title: 'ふたつ目の記事',data: '2021--03-02',…},markdownBody: '\r\nこれはふたつ目の記事です。'}
    return (
        <Layout>
            <div className="img-container">
                <Image src={props.frontmatter.image} alt="blog-image" height={500} width={1000} priority />
            </div>        
            <div className="wrapper">
                <div className="container">    
                    <h1>{props.frontmatter.title}</h1>
                    <p>{props.frontmatter.date}</p>
                    <ReactMarkdown>{props.markdownBody}</ReactMarkdown>
                </div>
            </div>
        </Layout>
    )
}
export default SingleBlog



export async function getStaticPaths() {
    const blogSlugs = ((context) => {
        const keys = context.keys()

        const data = keys.map((key, index) => {
            let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
            
            return slug
        })

        return data

    })(require.context('../../data', true, /\.md$/))

    const paths = blogSlugs.map((blogSlug) => `/blog/${blogSlug}`)

    //console.log(paths) // 出力=> ['/blog/fifth-blog','/blog/first-blog','/blog/fourth-blog','/blog/second-blog','/blog/sixth-blog','/blog/third-blog']

    return {
        paths: paths, // すべてのパスを返す.
        fallback: false, // false指定=>paths以外のパス名に対して404エラーページ表示させるため
    }
}


export async function getStaticProps(context) {
    const {slug} = context.params
    const data = await import(`../../data/${slug}.md`) // 任意のパス（のMDファイル）一つだけを読み込む.
    const singleDocument = matter(data.default) // gray-matterでYAML解析をしてMDファイルのデータをsingleDocumentに格納.'default'は何なのか不明.

    //console.log(singleDocument) // 出力=> {content:'\r\nこれは一つ目の記事です',data: {id: '1',title: 'ひとつ目の記事',data: '2021--03-01',…},…}

    return {
        props: {
            frontmatter: singleDocument.data, // frontmatter部分.
            markdownBody: singleDocument.content, // content部分（frontmatterの下部に書かれた文章）
        }
    }
}

