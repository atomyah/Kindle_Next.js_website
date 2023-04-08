import matter from 'gray-matter'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/layout'

const Blog = (props) => {
    //console.log(props)
    return (
        <Layout>
            <div className="wrapper">
                <div className="container">
                    <h1>Blog</h1>
                    <p>エンジニアの日常生活をお届けします</p>
                    {props.blogs.map((blog, index) => 
                        <div key={index} className="blogCard">
                            <div className="cardContainer">
                                <h3>{blog.frontmatter.title}</h3>
                                <p>{blog.frontmatter.date}</p>
                                <Link href={`/blog/${blog.slug}`}>READ MORE</Link>
                            </div>
                            <div className="blogImg">
                                <Image src={blog.frontmatter.image} alt="card-image" height={300} width={1000} quality={90} priority />
                            </div>                      
                        </div>           
                    )}
                </div>
            </div>
        </Layout>
    )
}
export default Blog

export async function getStaticProps() {
    const blogs =((context) => {
        const keys = context.keys() // console.log(keys) => ['./fifth-blog.md','./first-blog.md','./fourth-blog.md',…]が出力. マークダウンファイルのファイル名が入ってる.
        const values = keys.map(context) // console.log(values) => ６つの"Object [Module] { default: [Getter] }"が出力. マークダウンデータが入ってる.

        const data = keys.map((key, index) => {
            let slug = key.replace(/^.*[\/]/, '').slice(0, -3) //slugを生成.例=>./fourth-blog.mdをfourth-blogにしている
            const value = values[index]
            const document = matter(value.default)
                return {
                    frontmatter: document.data,
                    slug: slug
                }
        })
        
        return data

    })(require.context('../data', true, /\.md$/))

    //console.log(blogs)

    // 降順に記事をソート
    const orderedBlogs = blogs.sort((a,b) => {
        return b.frontmatter.id - a.frontmatter.id
    })

    return {
        props: {
                blogs:orderedBlogs
            },
    }
}
