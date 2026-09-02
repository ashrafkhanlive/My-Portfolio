import Container from '@/components/common/Container';
import { Separator } from '@/components/ui/separator';

export function BlogPageClient() {
  return (
    <Container className="py-16">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Blogs
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Thoughts, tutorials, and insights on engineering and programming.
          </p>
        </div>

        <Separator />

        <div className="flex min-h-[360px] flex-col items-center justify-center space-y-4 text-center">
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            Coming Soon
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            New blog posts are on the way.
          </h2>
          <p className="text-muted-foreground max-w-xl text-base">
            I am preparing fresh notes, tutorials, and developer journey posts.
            Check back soon.
          </p>
        </div>
      </div>
    </Container>
  );
}
