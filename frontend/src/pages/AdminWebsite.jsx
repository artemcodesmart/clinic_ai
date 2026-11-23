
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "./AdminWebsite.css";
import WebsitePreview from "../components/dashboard/WebsitePreview";
const createSection = () => ({
    type: "hero",
    title: "New section",
    subtitle: "",
    description: "",
    variant: "default",
    button_text: "",
    image: "",
    services: [],
    services_columns: 3,
    services_card_style: "default",
    services_image_height: "medium",
    services_spacing: "medium",
    services_text_align: "left",
});
function getImageId(image) {
    if (!image) return "";
    if (typeof image === "object") return image.id || "";
    return image;
}

function getImageUrl(image, assets) {
    if (!image) return "";

    if (typeof image === "object" && image.url) {
        return image.url;
    }

    const asset = assets.find(
        (item) => String(item.id) === String(getImageId(image))
    );

    return asset?.file || "";
}

function AdminWebsite() {
    const [pages, setPages] = useState([]);
    const [assets, setAssets] = useState([]);
    const [branding, setBranding] = useState(null);
    const [brandingDraft, setBrandingDraft] = useState(null);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const selectedPage = useMemo(
        () => pages.find((page) => page.id === selectedPageId) || null,
        [pages, selectedPageId]
    );

    // Load pages and media assets
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [pagesResponse, assetsResponse, brandingResponse] = await Promise.all([
                    api.get("/dashboard/pages/"),
                    api.get("/dashboard/assets/"),
                    api.get("/dashboard/branding/"),

                ]);

                const pagesData = Array.isArray(pagesResponse.data)
                    ? pagesResponse.data
                    : pagesResponse.data.results || [];

                const assetsData = Array.isArray(assetsResponse.data)
                    ? assetsResponse.data
                    : assetsResponse.data.results || [];

                setPages(pagesData);
                setAssets(assetsData);
                setBranding(brandingResponse.data);
                setBrandingDraft(brandingResponse.data);

                if (pagesData.length > 0) {
                    setSelectedPageId(pagesData[0].id);
                }
            } catch (err) {
                console.error("Website Builder loading error:", err);

                setError(
                    err.response?.data?.detail ||
                    "Could not load website data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Update selected page fields
    const updatePage = (field, value) => {
        setPages((currentPages) =>
            currentPages.map((page) =>
                page.id === selectedPageId
                    ? { ...page, [field]: value }
                    : page
            )
        );

        setSuccess("");
    };

    // Update a section field
    const updateSection = (sectionIndex, field, value) => {
        if (!selectedPage) return;

        const updatedSections = selectedPage.sections.map(
            (section, index) =>
                index === sectionIndex
                    ? { ...section, [field]: value }
                    : section
        );

        updatePage("sections", updatedSections);
    };

    // Add a new section
    const addSection = () => {
        if (!selectedPage) return;

        const sections = [
            ...(selectedPage.sections || []),
            createSection(),
        ];

        updatePage("sections", sections);
    };

    // Delete a section
    const deleteSection = (sectionIndex) => {
        if (!selectedPage) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this section?"
        );

        if (!confirmed) return;

        const sections = selectedPage.sections.filter(
            (_, index) => index !== sectionIndex
        );

        updatePage("sections", sections);
    };


const addService = (sectionIndex) => {
    if (!selectedPage) return;

    const updatedSections = selectedPage.sections.map(
        (section, index) =>
            index === sectionIndex
                ? {
                    ...section,
                    services: [
                        ...(section.services || []),
                        {
                            title: "",
                            description: "",
                            image: "",
                        },
                    ],
                }
                : section
    );

    updatePage("sections", updatedSections);
};

const updateService = (sectionIndex, serviceIndex, field, value) => {
    if (!selectedPage) return;

    const updatedSections = selectedPage.sections.map(
        (section, index) =>
            index === sectionIndex
                ? {
                    ...section,
                    services: section.services.map(
                        (service, sIndex) =>
                            sIndex === serviceIndex
                                ? { ...service, [field]: value }
                                : service
                    ),
                }
                : section
    );

    updatePage("sections", updatedSections);
};

const deleteService = (sectionIndex, serviceIndex) => {
    if (!selectedPage) return;

    const updatedSections = selectedPage.sections.map(
        (section, index) =>
            index === sectionIndex
                ? {
                    ...section,
                    services: section.services.filter(
                        (_, sIndex) => sIndex !== serviceIndex
                    ),
                }
                : section
    );

    updatePage("sections", updatedSections);
};


    // Convert image objects returned by GET into UUIDs expected by PATCH
    const prepareSectionsForSave = (sections) => {
        return sections.map((section) => ({
            ...section,
            image: getImageId(section.image),
        }));
    };

    const handleBrandingColorChange = (colorName, value) => {
    setBrandingDraft((previous) => ({
        ...previous,
        colors: {
            ...previous.colors,
            [colorName]: value,
        },
    }));
};
const saveBranding = async () => {
    try {
        setSaving(true);
        setError("");
        setSuccess("");

        const response = await api.patch(
            "/dashboard/branding/",
            brandingDraft
        );

        setBranding(response.data);
        setBrandingDraft(response.data);

        setSuccess("Branding saved successfully.");
    } catch (err) {
        console.error("Branding save error:", err);

        setError(
            err.response?.data?.detail ||
            "Could not save branding."
        );
    } finally {
        setSaving(false);
    }
};
const uploadLogo = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
        setUploadingLogo(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("logo", file);

        const response = await api.patch(
            "/dashboard/branding/",
            formData
        );

        setBranding(response.data);
        setBrandingDraft(response.data);

        setSuccess("Logo uploaded successfully.");
    } catch (err) {
        console.error("Logo upload error:", err);

        setError(
            err.response?.data?.logo?.[0] ||
            err.response?.data?.detail ||
            "Could not upload logo."
        );
    } finally {
        setUploadingLogo(false);
        event.target.value = "";
    }
};
    // Save page draft
    const savePage = async () => {
        if (!selectedPage) return false;

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                title: selectedPage.title,
                sections: prepareSectionsForSave(
                    selectedPage.sections || []
                ),
            };

            const response = await api.patch(
                `/dashboard/pages/${selectedPage.id}/`,
                payload
            );

            const updatedPage = response.data;

            setPages((currentPages) =>
                currentPages.map((page) =>
                    page.id === selectedPage.id
                        ? { ...page, ...updatedPage }
                        : page
                )
            );

            setSuccess("Changes saved successfully.");
            return true;
        } catch (err) {
            console.error("Save page error:", err);

            setError(
                err.response?.data?.detail ||
                JSON.stringify(err.response?.data) ||
                "Could not save changes."
            );

            return false;
        } finally {
            setSaving(false);
        }
    };

    // Save changes first, then publish the saved version
    const publishPage = async () => {
        if (!selectedPage) return;

        const saved = await savePage();

        if (!saved) return;

        try {
            setPublishing(true);
            setError("");
            setSuccess("");

            await api.post(
                `/dashboard/pages/${selectedPage.id}/publish/`
            );

            setPages((currentPages) =>
                currentPages.map((page) =>
                    page.id === selectedPage.id
                        ? { ...page, is_published: true }
                        : page
                )
            );

            setSuccess("Website page published successfully.");
        } catch (err) {
            console.error("Publish page error:", err);

            setError(
                err.response?.data?.detail ||
                "Could not publish this page."
            );
        } finally {
            setPublishing(false);
        }
    };

    if (loading) {
        return (
            <div className="website-state">
                <div className="website-spinner" />
                <p>Loading website builder...</p>
            </div>
        );
    }

    if (error && pages.length === 0) {
        return (
            <div className="website-state website-error">
                <h2>Something went wrong</h2>
                <p>{error}</p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="website-builder">

            {/* Header */}

            <header className="website-builder-header">
                <div>
                    <span className="website-eyebrow">
                        CLINIC WEBSITE MANAGEMENT
                    </span>

                    <h1>Website Builder</h1>

                    <p>
                        Create and customize your clinic website.
                    </p>
                </div>

                <div className="website-header-actions">
                    <button
                        type="button"
                        className="website-save-button"
                        onClick={savePage}
                        disabled={!selectedPage || saving || publishing}
                    >
                        {saving ? "Saving..." : "Save changes"}
                    </button>

                    <button
                        type="button"
                        className="website-publish-button"
                        onClick={publishPage}
                        disabled={!selectedPage || saving || publishing}
                    >
                        {publishing ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </header>

            {/* Notifications */}
            {error && (
                <div className="website-notification error">
                    {error}
                    <button
                        type="button"
                        onClick={() => setError("")}
                    >
                        ×
                    </button>
                </div>
            )}

            {success && (
                <div className="website-notification success">
                    {success}
                    <button
                        type="button"
                        onClick={() => setSuccess("")}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="website-builder-content">

                {/* Pages sidebar */}
                <aside className="website-pages-panel">
                    <div className="website-panel-heading">
                        <div>
                            <h2>Pages</h2>
                            <p>Manage your website pages</p>
                        </div>

                        <span className="website-count">
                            {pages.length}
                        </span>
                    </div>

                    <div className="website-pages-list">
                        {pages.map((page) => (
                            <button
                                type="button"
                                key={page.id}
                                className={
                                    selectedPageId === page.id
                                        ? "website-page-item active"
                                        : "website-page-item"
                                }
                                onClick={() => {
                                    setSelectedPageId(page.id);
                                    setError("");
                                    setSuccess("");
                                }}
                            >
                                <span className="website-page-icon">
                                    <span className="website-page-dot" />
                                </span>

                                <span className="website-page-info">
                                    <strong>{page.title}</strong>
                                    <small>/{page.slug}</small>
                                </span>

                                <span className="website-page-arrow">
                                    ›
                                </span>
                            </button>
                        ))}
                    </div>

                    {pages.length === 0 && (
                        <p className="website-empty-message">
                            No pages created yet.
                        </p>
                    )}
                </aside>

                {/* Main editor */}
                <main className="website-editor-panel">

                <div className="branding-editor">
    <h3>Clinic Branding</h3>
    <p>Customize your clinic website colors.</p>

    <div className="branding-color-field">
        <label htmlFor="primary-color">Primary color</label>
        <input
            id="primary-color"
            type="color"
            value={brandingDraft?.colors?.primary || "#2563eb"}
            onChange={(event) =>
                handleBrandingColorChange("primary", event.target.value)
            }
        />
    </div>
    <button
    type="button"
    onClick={saveBranding}
    disabled={saving || !brandingDraft}
>
    {saving ? "Saving..." : "Save Branding"}
</button>


    <div className="branding-color-field">
        <label htmlFor="secondary-color">Text color</label>
        <input
            id="secondary-color"
            type="color"
            value={brandingDraft?.colors?.secondary || "#111827"}
            onChange={(event) =>
                handleBrandingColorChange("secondary", event.target.value)
            }
        />
    </div>

    <div className="branding-color-field">
        <label htmlFor="background-color">Background color</label>
        <input
            id="background-color"
            type="color"
            value={brandingDraft?.colors?.background || "#ffffff"}
            onChange={(event) =>
                handleBrandingColorChange("background", event.target.value)
            }
        />
    </div>
    <div className="branding-logo-field">
    <h3>Clinic Logo</h3>

    {brandingDraft?.logo && (
        <img
            src={
                typeof brandingDraft.logo === "object"
                    ? brandingDraft.logo.url
                    : brandingDraft.logo
            }
            alt="Clinic logo"
            className="branding-logo-preview"
        />
    )}

    <label htmlFor="clinic-logo">
        {uploadingLogo ? "Uploading..." : "Upload Logo"}
    </label>

    <input
        id="clinic-logo"
        type="file"
        accept="image/*"
        onChange={uploadLogo}
        disabled={uploadingLogo}
    />
</div>
    <div className="branding-typography">
    <h3>Typography</h3>

    <div className="branding-color-field">
        <label htmlFor="font-family">Font Family</label>


        <select
            id="font-family"
            value={
                brandingDraft?.typography?.font_family || "Inter"
            }
            onChange={(event) =>
                setBrandingDraft((previous) => ({
                    ...previous,
                    typography: {
                        ...previous.typography,
                        font_family: event.target.value,
                    },
                }))
            }
        >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Poppins">Poppins</option>
        </select>
        <div className="branding-color-field">
    <label htmlFor="heading-size">Heading Size</label>

    <select
        id="heading-size"
        value={
            brandingDraft?.typography?.heading_size || "32px"
        }
        onChange={(event) =>
            setBrandingDraft((previous) => ({
                ...previous,
                typography: {
                    ...previous.typography,
                    heading_size: event.target.value,
                },
            }))
        }
    >
        <option value="28px">Small — 28px</option>
        <option value="32px">Medium — 32px</option>
        <option value="40px">Large — 40px</option>
        <option value="48px">Extra Large — 48px</option>
        <option value="56px">XX Large — 56px</option>
    </select>
</div>
<div className="branding-global-styles">
    <h3>Global Styles</h3>

    <div className="branding-color-field">
        <label htmlFor="border-radius">
            Border Radius
        </label>

        <select
            id="border-radius"
            value={
                brandingDraft?.global_styles?.border_radius || "12px"
            }
            onChange={(event) =>
                setBrandingDraft((previous) => ({
                    ...previous,
                    global_styles: {
                        ...previous.global_styles,
                        border_radius: event.target.value,
                    },
                }))
            }
        >
            <option value="0px">None — 0px</option>
            <option value="4px">Small — 4px</option>
            <option value="8px">Medium — 8px</option>
            <option value="12px">Large — 12px</option>
            <option value="20px">Extra Large — 20px</option>
            <option value="28px">XX Large — 28px</option>
        </select>
    </div>
</div>


    </div>

</div>

</div>

                    {!selectedPage ? (
                        <div className="website-empty">
                            <h2>No page selected</h2>
                            <p>
                                Create a page in your clinic dashboard
                                to start building your website.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Page settings */}
                            <div className="website-editor-top">
                                <div>
                                    <span className="website-eyebrow">
                                        PAGE SETTINGS
                                    </span>

                                    <h2>{selectedPage.title}</h2>

                                    <p className="website-page-url">
                                        /{selectedPage.slug}
                                    </p>
                                </div>

                                <span
                                    className={
                                        selectedPage.is_published
                                            ? "website-status published"
                                            : "website-status draft"
                                    }
                                >
                                    {selectedPage.is_published
                                        ? "Published"
                                        : "Draft"}
                                </span>
                            </div>

                            <div className="website-page-settings">
                                <label>
                                    Page title

                                    <input
                                        type="text"
                                        value={selectedPage.title || ""}
                                        onChange={(event) =>
                                            updatePage(
                                                "title",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter page title"
                                    />
                                </label>
                            </div>

                            {/* Sections */}
                            <div className="website-sections-heading">
                                <div>
                                    <h3>Page sections</h3>
                                    <p>
                                        Edit the content and appearance
                                        of each section.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="website-add-button"
                                    onClick={addSection}
                                >
                                    + Add section
                                </button>
                            </div>

                            <div className="website-sections-list">

                                {(selectedPage.sections || []).map(
                                    (section, index) => {
                                        const imageUrl = getImageUrl(
                                            section.image,
                                            assets
                                        );

                                        return (
                                            <section
                                                className="website-section-card"
                                                key={index}
                                            >
                                                <div className="website-section-card-header">
                                                    <div className="website-section-number">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </div>

                                                    <div className="website-section-heading">
                                                        <strong>
                                                            {section.type || "Section"}
                                                        </strong>

                                                        <small>
                                                            Section {index + 1}
                                                        </small>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="website-delete-button"
                                                        onClick={() =>
                                                            deleteSection(index)
                                                        }
                                                        title="Delete section"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>

                                                <div className="website-section-fields">

                                                    <label>
                                                        Section type

                                                        <select
                                                            value={section.type || "hero"}
                                                            onChange={(event) =>
                                                                updateSection(
                                                                    index,
                                                                    "type",
                                                                    event.target.value
                                                                )
                                                            }
                                                        >
                                                            <option value="hero">Hero</option>
                                                            <option value="text">Text</option>
                                                            <option value="about">About Us</option>
                                                            <option value="services">Services</option>
                                                        </select>
                                                    </label>

                                                   {section.type === "hero" && (
    <label>
        Hero Style

        <select
            value={section.variant || "default"}
            onChange={(event) =>
                updateSection(
                    index,
                    "variant",
                    event.target.value
                )
            }
        >
            <option value="default">Default</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>

            <option value="classic">Classic</option>

        </select>
        <small>Selected style: {section.variant}</small>

    </label>
)}
                                                    {section.type === "hero" && (
                                                        <>
                                                            {/* Heading */}

                                                    <label className="field-full">
                                                        Heading

                                                        <input
                                                            type="text"
                                                            value={section.title || ""}
                                                            onChange={(event) =>
                                                                updateSection(
                                                                    index,
                                                                    "title",
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder="Enter heading"
                                                        />
                                                    </label>

                                                    <label className="field-full">
                                                        Subtitle

                                                        <input
                                                            type="text"
                                                            value={section.subtitle || ""}
                                                            onChange={(event) =>
                                                                updateSection(
                                                                    index,
                                                                    "subtitle",
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder="Enter subtitle"
                                                        />
                                                    </label>


                                                    <label className="field-full">
                                                        Description

                                                        <textarea
                                                            rows={4}
                                                            value={section.description || ""}
                                                            onChange={(event) =>
                                                                updateSection(
                                                                    index,
                                                                    "description",
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder="Write section description..."
                                                        />
                                                    </label>

                                                    <label className="field-full">
                                                        Button text

                                                        <input
                                                            type="text"
                                                            value={section.button_text || ""}
                                                            onChange={(event) =>
                                                                updateSection(
                                                                    index,
                                                                    "button_text",
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder="Book Appointment"
                                                        />
                                                    </label>
                                                        </>
)}

{section.type === "services" && (
    <div className="website-services-editor field-full">

        <h3>Services</h3>

        <label>
    Cards per row
    <label>
    Card Style
    <label>
    Image Height
    <label>
    Card Spacing
    <label>
    Text Alignment

    <select
        value={section.services_text_align || "left"}
        onChange={(event) =>
            updateSection(
                index,
                "services_text_align",
                event.target.value
            )
        }
    >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
    </select>
</label>

    <select
        value={section.services_spacing || "medium"}
        onChange={(event) =>
            updateSection(
                index,
                "services_spacing",
                event.target.value
            )
        }
    >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
    </select>
</label>

    <select
        value={section.services_image_height || "medium"}
        onChange={(event) =>
            updateSection(
                index,
                "services_image_height",
                event.target.value
            )
        }
    >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
    </select>
</label>

    <select
        value={section.services_card_style || "default"}
        onChange={(event) =>
            updateSection(
                index,
                "services_card_style",
                event.target.value
            )
        }
    >
        <option value="default">Default</option>
        <option value="minimal">Minimal</option>
        <option value="elevated">Elevated</option>
    </select>
</label>

    <select
        value={section.services_columns || 3}
        onChange={(event) =>
            updateSection(
                index,
                "services_columns",
                Number(event.target.value)
            )
        }
    >
        <option value={1}>1 column</option>
        <option value={2}>2 columns</option>
        <option value={3}>3 columns</option>
    </select>
</label>

        {(section.services || []).map((service, serviceIndex) => (
            <div
                className="website-service-editor-card"
                key={serviceIndex}
            >
                <div className="website-service-editor-header">
                    <strong>
                        Service {serviceIndex + 1}
                    </strong>

                    <button
                        type="button"
                        onClick={() =>
                            deleteService(index, serviceIndex)
                        }
                    >
                        Delete
                    </button>
                </div>

                <label>
                    Service title

                    <input
                        type="text"
                        value={service.title || ""}
                        onChange={(event) =>
                            updateService(
                                index,
                                serviceIndex,
                                "title",
                                event.target.value
                            )
                        }
                        placeholder="Dental Implants"
                    />
                </label>

                <label>
                    Service description

<label>
    Service image

    <select
        value={getImageId(service.image)}
        onChange={(event) =>
            updateService(
                index,
                serviceIndex,
                "image",
                event.target.value
            )
        }
    >
        <option value="">No image</option>

        {assets.map((asset) => (
            <option
                key={asset.id}
                value={asset.id}
            >
                {asset.name}
            </option>
        ))}
    </select>
</label>

{getImageUrl(service.image, assets) && (
    <div className="website-service-image-preview">
        <img
            src={getImageUrl(service.image, assets)}
            alt={service.title || "Service image"}
        />
    </div>
)}


                    <textarea
                        rows={3}
                        value={service.description || ""}
                        onChange={(event) =>
                            updateService(
                                index,
                                serviceIndex,
                                "description",
                                event.target.value
                            )
                        }
                        placeholder="Describe this service..."
                    />
                </label>
            </div>
        ))}

        <button
            type="button"
            className="website-add-button"
            onClick={() => addService(index)}
        >
            + Add Service
        </button>

    </div>
)}


                                                    {/* Image library */}
                                                    <label className="field-full">
                                                        Section image

                                                        <select
                                                            value={getImageId(section.image)}
                                                            onChange={(event) =>
                                                                updateSection(
                                                                    index,
                                                                    "image",
                                                                    event.target.value
                                                                )
                                                            }
                                                        >
                                                            <option value="">
                                                                No image
                                                            </option>

                                                            {assets.map((asset) => (
                                                                <option
                                                                    key={asset.id}
                                                                    value={asset.id}
                                                                >
                                                                    {asset.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>

                                                    {imageUrl && (
                                                        <div className="website-image-preview field-full">
                                                            <img
                                                                src={imageUrl}
                                                                alt={
                                                                    section.image?.alt_text ||
                                                                    "Section preview"
                                                                }
                                                            />
                                                        </div>
                                                    )}

                                                    {assets.length === 0 && (
                                                        <p className="website-no-assets field-full">
                                                            Your Media Library is empty.
                                                            Upload images in the clinic
                                                            dashboard first.
                                                        </p>
                                                    )}
                                                </div>
                                            </section>
                                        );
                                    }
                                )}

                                {(selectedPage.sections || []).length === 0 && (
                                    <div className="website-empty-sections">
                                        <h3>No sections yet</h3>
                                        <p>
                                            Add your first section to start
                                            building this page.
                                        </p>

                                        <button
                                            type="button"
                                            className="website-add-button"
                                            onClick={addSection}
                                        >
                                            + Add first section
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Bottom actions */}
                            <div className="website-bottom-actions">
                                <span>
                                    {selectedPage.sections?.length || 0} sections
                                </span>

                                <button
                                    type="button"
                                    className="website-save-button"
                                    onClick={savePage}
                                    disabled={saving || publishing}
                                >
                                    {saving ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        </>
                    )}
                </main>
                  {/* Live Website Preview */}
                <aside className="website-preview-panel">
                    <WebsitePreview page={selectedPage}
                    assets={assets}
                     branding={brandingDraft}/>
                </aside>

            </div>
        </div>
    );
}

export default AdminWebsite;
