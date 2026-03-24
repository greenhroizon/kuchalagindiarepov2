import React, { useEffect, useState } from "react";
import { Typography, Card, Spin, Alert } from "antd";
import { staticContent } from "../apis/service";

const { Title, Paragraph } = Typography;

const Privacy = () => {
  const [privacy, setPrivacy] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const response = await staticContent();

      if (response?.data?.length > 0) {
        const privacyData = response.data.find(
          (item) => item.type === "PRIVACY_POLICY" && item.isActive
        );

        setPrivacy(privacyData || null);
      }
    } catch (error) {
      console.error("Failed to fetch privacy policy", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "15%" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!privacy) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto" }}>
        <Alert
          message="Privacy Policy not available"
          description="Please check back later."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <section style={{ padding: "40px 16px", background: "#fafafa",marginTop:"3%" }} className="bg-index">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          {"Privacy Policy"}
        </Title>

        <Card
          bordered={false}
          style={{
            marginTop: 24,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            borderRadius: 12,
          }}
        >
          {/* Render backend HTML safely */}
          <div
            dangerouslySetInnerHTML={{ __html: privacy.content }}
            style={{ fontSize: 16, lineHeight: 1.8 }}
          />
        </Card>
      </div>
    </section>
  );
};

export default Privacy;
