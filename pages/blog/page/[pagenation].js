//import matter from 'gray-matter'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../../../components/layout'
import { getAllBlogs, blogsPerPage } from '../../../utils/mdQueries'
import Pagination from '../../../components/pagination'
import Seo from '../../../components/seo'

const PaginationPage = (props) => {
    //console.log(props)
    return (
        <Layout>
            <Seo title="ブログ（ページネーション）" description="ブログのページネーションです" />
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
export default PaginationPage

export async function getStaticPaths() {
    const { numberPages } = await getAllBlogs() // numberPagesは 2 総ページ数のこと

    let paths = []
    Array.from({ length: numberPages }).slice(0, 1).forEach((_ , i) => paths.push(`/blog/page/${i + 2}`))
    // numberPagesは2.ゆえにArray.fromで配列[undefined, undefined]が作成される. slice(0,1)で最初の要素配列[undefined]が作成され
    // forEach(_,i)で要素ひとつずつを取り出し(_はプレースホルダー,iはindex)、paths配列に`/blog/page/${i + 2}`
    // つまり/blog/page/${0 + 2}、つまり/blog/page/2が最初の要素となるpaths配列ができる. 記事が12件あったら・・・？
    console.log('◆paths')
    console.log(paths) // 出力：[ '/blog/page/2' ]

    return {
        paths: paths,
        fallback: false,
    }
}

export async function getStaticProps(context) {
    const { orderedBlogs, numberPages } = await getAllBlogs()

    const currentPage = context.params.pagenation // 現在のページを取得.ここでは必ず２
    console.log('◆context')
    console.log(context)
    console.log('◆currentPage')
    console.log(currentPage) // 出力：2
    const limitedBlogs = orderedBlogs.slice((currentPage -1) * blogsPerPage, currentPage * blogsPerPage)
                        // orderedBlogsは6つ. slice(1*5, 2*5)で6番目から11番目をスライスで取り出しlimitedBlogsへ.

    return {
        props: {
                blogs:limitedBlogs,
                numberPages: numberPages
            },
    }
}
