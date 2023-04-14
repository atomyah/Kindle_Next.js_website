import matter from "gray-matter";

export const blogsPerPage = 5 // ページネーション.

export async function getAllBlogs() {
    const blogs = ((context) => {
        const keys = context.keys() // console.log(keys) => ['./fifth-blog.md','./first-blog.md','./fourth-blog.md',…]が出力. マークダウンファイルのファイル名が入ってる.
        const values = keys.map(context)  // console.log(values) => ６つの"Object [Module] { default: [Getter] }"が出力. マークダウンデータが入ってる.
        const data = keys.map((key, index) => {
            let slug = key.replace(/^.*[\/]/, '').slice(0, -3) //slugを生成.例=>./fourth-blog.mdをfourth-blogにしている
            const value = values[index]
            const document = matter(value.default)
            return {
                frontmatter: document.data, // MDファイルのfrontmatter部分. コンテンツ部分はdocument.content.
                slug: slug
            }
        })
        return data
    })(require.context('../data', true, /\.md$/))

    const orderedBlogs = blogs.sort((a, b) => { // blogsを降順でソート. 参考：https://www.sejuku.net/blog/62904（比較関数）
        return b.frontmatter.id - a.frontmatter.id
    })

    const numberPages = Math.ceil(orderedBlogs.length / blogsPerPage) // ページネーション. Math.ceilは切り上げ. 記事数６でblogPerPage５なのでnumberPagesは２
    console.log('◆numberPages')
    console.log(numberPages) // 出力：2 総ページ数のこと

    return {
        orderedBlogs: orderedBlogs,
        numberPages: numberPages
    }
}

export async function getSingleBlog(context) {
    const {slug} = context.params
    const data = await import(`../data/${slug}.md`)
    const singleDocument = matter(data.default)

    return {
        singleDocument: singleDocument
    }
}