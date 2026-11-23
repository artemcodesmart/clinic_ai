
import { useState } from "react";
import "./WebsitePreview.css";

function getFileUrl(file) {
    if (!file) return "";

    if (typeof file === "object") {
        return file.url || "";
    }

    return file;
}

function getPreviewImageUrl(image, assets) {
    if (!image) return "";

    // Изображение уже пришло объектом от Django
    if (typeof image === "object") {
        return image.url || "";
    }

    // Изображение только что выбрали в редакторе.
    // В этом случае image содержит UUID.
    const asset = assets.find(
        (item) => String(item.id) === String(image)
    );

    return getFileUrl(asset?.file);
}

function WebsitePreview({
    page,
    assets = [],
    branding = null,
}) {
    const [device, setDevice] = useState("desktop");

    if (!page) {
        return (
            <div className="website-preview-empty">
                Select a page to preview
            </div>
        );
    }

    const sections = page.sections || [];

    const colors = branding?.colors || {};
    const typography = branding?.typography || {};
    const globalStyles = branding?.global_styles || {};

    const previewStyle = {
        "--preview-primary": colors.primary || "#2563eb",
        "--preview-secondary": colors.secondary || "#111827",
        "--preview-background": colors.background || "#ffffff",
        "--preview-font-family": typography.font_family || "Inter",
        "--preview-heading-size": typography.heading_size || "32px",
        "--preview-border-radius": globalStyles.border_radius || "12px",
    };

    const logoUrl = getFileUrl(branding?.logo);

    return (
        <div className="website-preview">
            <div className="preview-toolbar">
                <div>
                    <h3>Live Preview</h3>
                    <span>See how your website looks</span>
                </div>

                <div className="preview-devices">
                    {["desktop", "tablet", "mobile"].map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={device === item ? "active" : ""}
                            onClick={() => setDevice(item)}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="preview-canvas">
                <div className={`preview-browser ${device}`}>
                    <div className="preview-browser-bar">
                        <div className="preview-browser-dots">
                            <span />
                            <span />
                            <span />
                        </div>

                        <div className="preview-browser-url">
                            clinic-website.com
                        </div>
                    </div>

                    <div
                        className="preview-website"
                        style={previewStyle}
                    >
                        <header className="preview-navbar">
                            <div className="preview-logo">
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt="Clinic logo"
                                    />
                                ) : (
                                    "Your Clinic"
                                )}
                            </div>

                            <nav>
                                <span>Home</span>
                                <span>Services</span>
                                <span>Our Doctors</span>
                                <span>Contact</span>
                            </nav>

                            <button type="button">
                                Book Appointment
                            </button>
                        </header>

                        {sections.map((section, index) => (
                            <PreviewSection
                                key={section.id || index}
                                section={section}
                                assets={assets}
                            />
                        ))}

                        {sections.length === 0 && (
                            <div className="preview-empty-content">
                                Your website sections will appear here.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PreviewSection({ section, assets }) {
    const imageUrl = getPreviewImageUrl(section.image, assets);

    if (section.type === "hero") {
        return (
            <section
                className={`preview-hero ${section.variant || "default"}`}
            >
                <div className="preview-hero-content">
                    <span className="preview-eyebrow">
                        PROFESSIONAL DENTAL CARE
                    </span>

                    <h1>
                        {section.title || "Your Smile Matters"}
                    </h1>

                    <h2>{section.subtitle}</h2>

                    <p>{section.description}</p>

                    {section.button_text && (
                        <button
                            type="button"
                            className="preview-cta"
                        >
                            {section.button_text}
                        </button>
                    )}
                </div>

                {imageUrl && (
                    <div className="preview-hero-image">
                        <img
                            src={imageUrl}
                            alt={
                                typeof section.image === "object"
                                    ? section.image?.alt_text || ""
                                    : "Clinic section"
                            }
                        />
                    </div>
                )}
            </section>
        );
    }

    if (section.type === "text" || section.type === "about") {
        return (
            <section className="preview-text-section">
                <h2>{section.title || "About Our Clinic"}</h2>
                <p>{section.description}</p>
            </section>
        );
    }


if (section.type === "services") {
    return (
        <section className="preview-services-section">
            <h2>{section.title || "Our Services"}</h2>

            {section.description && (
                <p>{section.description}</p>
            )}


    <div
    className={`preview-services-grid columns-${section.services_columns || 3} spacing-${section.services_spacing || "medium"}`}
>
    {(section.services || []).map((service, index) => {
        const serviceImage = getPreviewImageUrl(
            service.image,
            assets
        );

        return (
            <article
    className={`preview-service-card style-${section.services_card_style || "default"}`}
    key={index}
>
                {serviceImage && (
                    <div
    className={`preview-service-card-image height-${section.services_image_height || "medium"}`}
>
                        <img
                            src={serviceImage}
                            alt={service.title || "Dental service"}
                        />
                    </div>
                )}

               <div
    className={`preview-service-card-content align-${section.services_text_align || "left"}`}
>
                    <h3>{service.title || "Service name"}</h3>

                    <p>
                        {service.description || "Service description"}
                    </p>
                </div>
            </article>
        );
    })}
</div>


            {(section.services || []).length === 0 && (
                <div className="preview-service-placeholder">
                    Add services in the editor to see them here.
                </div>
            )}
        </section>
    );
}

    return (
        <section className="preview-text-section">
            <h2>{section.title || "New Section"}</h2>
            <p>{section.description}</p>
        </section>
    );
}

export default WebsitePreview;
