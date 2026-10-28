import { lorem } from "@/data/content";
import { Art, Button, SectionTitle } from "./ui";

export default function About() {
  return (
    <section className="container-x py-12">
      <SectionTitle title="About Us" subtitle={lorem} />
      <div className="grid items-center gap-8 md:grid-cols-2">
        <Art hue={["#4a4a4a", "#0a0a0a"]} className="aspect-[4/3] rounded-lg" />
        <div>
          <h3 className="text-lg font-semibold">Fashion That Speaks</h3>
          <p className="mt-4 text-[11px] leading-relaxed text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar.
          </p>
          <Button className="mt-6">Show more</Button>
        </div>
      </div>
    </section>
  );
}
