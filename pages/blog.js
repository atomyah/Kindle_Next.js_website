//import matter from 'gray-matter'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/layout'
import { getAllBlogs, blogsPerPage } from '../utils/mdQueries'
import Pagination from '../components/pagination'
import Seo from '../components/seo'

const Blog = (props) => {
    //console.log(props)
    return (
        <Layout>
            <Seo title="ブログ" description="これはブログページです" />
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
                <Pagination numberPages={props.numberPages} />
            </div>
        </Layout>
    )
}
export default Blog

export async function getStaticProps() {
    const { orderedBlogs, numberPages } = await getAllBlogs()

    const limitedBlogs = orderedBlogs.slice(0, blogsPerPage) // 6つあるorderedBlogsをslice(0, 5)で５つだけ取り出す.

    return {
        props: {
                blogs:limitedBlogs,
                numberPages: numberPages //"mdQueries.js"よりnumberPagesは２
            },
    }
}
